// A small in-memory cache for data that is read often and changes rarely.
//
//  1. TTL      every entry is forgotten after some seconds, even if nothing told us it changed (safety net)
//  2. LRU      when the cache is full, the entry that was used the longest time ago is thrown away
//  3. remember()  look in the cache first, if it is not there load it from the database and keep it.
//                 If 20 requests ask for the same missing thing at the same moment, only ONE database query runs
//  4. keyOf() / bump()  clearing by version numbers: every group of data has a version. The version is part of the key,
//                 so when something changes we only add 1 to the version and the old entries can never be found again
//
// Rule: never change what you get out of the cache. It is shared by all requests.
// It lives in the memory of the server, so it starts empty after a restart (Render's free server sleeps), which is fine.

const MAX_ENTRIES = 300

// CACHE_ENABLED=false switches the whole cache off (every read goes to the database).
// Used to measure what the cache gives: run scripts/benchmark.js once with it off and once with it on.
const enabled = () => process.env.CACHE_ENABLED !== "false"

const entries = new Map()    // key -> { value, expiresAt }. A Map remembers the order of insertion: the oldest is first
const loading = new Map()    // key -> the promise of a database load that is running right now
const versions = new Map()   // name of a group -> its version number

export const get = (key) => {
  if (!enabled()) return undefined
  const entry = entries.get(key)
  if (!entry) return undefined
  if (entry.expiresAt <= Date.now()) {
    entries.delete(key)
    return undefined
  }
  entries.delete(key)          // take it out and put it back at the end: it was used just now
  entries.set(key, entry)
  return entry.value
}

export const set = (key, value, ttlSeconds) => {
  if (!enabled()) return
  entries.delete(key)
  entries.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 })
  if (entries.size > MAX_ENTRIES) {
    entries.delete(entries.keys().next().value)   // the first one is the least recently used
  }
}

export const remember = (key, ttlSeconds, load) => {
  if (!enabled()) return load()

  const cached = get(key)
  if (cached !== undefined) return Promise.resolve(cached)

  if (loading.has(key)) return loading.get(key)    // somebody is already loading it, wait for that one

  const promise = (async () => {
    try {
      const value = await load()
      if (value !== null && value !== undefined) set(key, value, ttlSeconds)   // "not found" is not kept
      return value
    } finally {
      loading.delete(key)
    }
  })()
  loading.set(key, promise)
  return promise
}

// the key of a piece of data inside some groups: keyOf(["ws:5"], "tasks") -> "ws:5@3|tasks"
// (always lower case: an id written with capital letters in a url is still the same id)
export const keyOf = (groups, name) =>
  (groups.map((group) => `${group}@${versions.get(group.toLowerCase()) || 0}`).join("|") + "|" + name).toLowerCase()

// something in these groups changed: all their old entries are useless from now on
export const bump = (...groups) => {
  groups.forEach((group) => versions.set(group.toLowerCase(), (versions.get(group.toLowerCase()) || 0) + 1))
}
