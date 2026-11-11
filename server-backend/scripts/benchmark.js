// Measures how fast the API answers. It is READ ONLY (it only sends GET requests, after one login).
//
//   node scripts/benchmark.js <api url> <email> <password> [rounds] [pause in ms]
//   node scripts/benchmark.js https://my-api.onrender.com me@mail.com mypassword 20
//
// To see what the cache gives: set CACHE_ENABLED=false on the server, restart it, run this. Then set it to true
// (or remove it), restart, run this again, and compare the two tables.
//
// The numbers include the network between this computer and the API, which is what a real user feels too.
// The pause (default 250 ms) keeps the script under the rate limit of the API, so a slow answer is never a blocked one.
const [base, email, password, roundsArg, pauseArg] = process.argv.slice(2)
if (!base || !email || !password) {
  console.log("Usage: node scripts/benchmark.js <api url> <email> <password> [rounds] [pause in ms]")
  process.exit(1)
}
const rounds = Number(roundsArg) || 20
const pause = pauseArg === undefined ? 250 : Number(pauseArg)
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

let requests = 0
let blocked = 0
let token = ""

// one request, timed until the whole answer arrived. A 429 (rate limit) is waited out and not counted as a measurement.
const timed = async (path) => {
  for (;;) {
    const start = performance.now()
    const res = await fetch(base + path, { headers: { Authorization: `Bearer ${token}` } })
    await res.arrayBuffer()
    const ms = performance.now() - start
    if (res.status === 429) {
      blocked++
      await wait((Number(res.headers.get("retry-after")) || 1) * 1000)
      continue
    }
    requests++
    return { ms, status: res.status }
  }
}

const json = async (path) => (await fetch(base + path, { headers: { Authorization: `Bearer ${token}` } })).json()
const percentile = (sorted, p) => sorted[Math.min(Math.ceil((p / 100) * sorted.length) - 1, sorted.length - 1)]
const round = (n) => (n < 10 ? n.toFixed(1) : Math.round(n)).toString().padStart(8)

// ---------- login and find something to measure
const login = await fetch(`${base}/api/users/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
})
if (!login.ok) {
  console.log("Login failed:", login.status, (await login.json().catch(() => ({}))).message || "")
  process.exit(1)
}
token = (await login.json()).token

const workspaces = await json("/api/workspaces")
if (!workspaces.length) {
  console.log("This account has no workspace to measure.")
  process.exit(1)
}
const ws = workspaces[0].id
const projects = await json(`/api/workspace/${ws}/projects`)
const project = projects[0]?._id

const endpoints = [
  ["workspaces (sidebar)", "/api/workspaces", "cached"],
  ["details", `/api/workspace/${ws}/details`, "cached"],
  ["home stats", `/api/workspace/${ws}/home`, ""],
  ["project list", `/api/workspace/${ws}/projects`, "cached"],
  ["My Tasks", `/api/workspace/${ws}/tasks`, "cached"],
  ["members", `/api/workspace/${ws}/members`, ""],
]
if (project) {
  endpoints.push(["project page", `/api/projects/${project}`, ""])
  endpoints.push(["board (task list)", `/api/workspace/${ws}/projects/${project}/tasks`, "cached"])
}

// ---------- each endpoint, one after the other, over and over
const times = new Map(endpoints.map(([name]) => [name, []]))
for (let round = 0; round < rounds; round++) {
  for (const [name, path] of endpoints) {
    const { ms, status } = await timed(path)
    if (status !== 200) console.log(`  ! ${name} answered ${status}`)
    times.get(name).push(ms)
    await wait(pause)
  }
}

// ---------- what a page really asks for at once (the browser sends these together)
const flows = [
  ["open Home page", ["/api/workspaces", `/api/workspace/${ws}/details`, `/api/workspace/${ws}/home`]],
]
if (project) {
  flows.push(["open a Board page", ["/api/workspaces", `/api/workspace/${ws}/details`, `/api/projects/${project}`, `/api/workspace/${ws}/projects/${project}/tasks`, `/api/workspace/${ws}/members`]])
}
const flowTimes = new Map(flows.map(([name]) => [name, []]))
for (let round = 0; round < Math.max(Math.floor(rounds / 2), 5); round++) {
  for (const [name, paths] of flows) {
    const start = performance.now()
    await Promise.all(paths.map((path) => timed(path)))
    flowTimes.get(name).push(performance.now() - start)
    await wait(pause)
  }
}

// ---------- the answer
const row = (name, list, mark = "") => {
  const sorted = [...list].sort((a, b) => a - b)
  const rest = sorted.length > 1 ? list.slice(1).sort((a, b) => a - b) : sorted
  console.log(
    `${name.padEnd(22)}${round(list[0])}${round(percentile(rest, 50))}${round(percentile(rest, 95))}${round(sorted.at(-1))}   ${mark}`
  )
}
console.log(`\nAPI: ${base}   (${requests} requests, ${rounds} rounds, ${blocked} waited for the rate limit)`)
console.log("times in milliseconds\n")
console.log(`${"endpoint".padEnd(22)}${"first".padStart(8)}${"median".padStart(8)}${"p95".padStart(8)}${"max".padStart(8)}`)
console.log("-".repeat(54))
endpoints.forEach(([name, , mark]) => row(name, times.get(name), mark ? "<- cached" : ""))
console.log("-".repeat(54))
console.log("whole pages (several requests at once)")
flows.forEach(([name]) => row(name, flowTimes.get(name)))
console.log('\n"first" = the very first request (an empty cache). "median" and "p95" = the later ones.')
console.log("p95 = 95 of 100 requests were faster than this.")
