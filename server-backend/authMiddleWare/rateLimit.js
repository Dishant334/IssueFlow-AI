import jwt from "jsonwebtoken"
import { limiters } from "../services/rateLimiters.js"

const waitText = (seconds) =>
  seconds < 60 ? `${seconds} seconds` : seconds < 3600 ? `${Math.ceil(seconds / 60)} minutes` : `${Math.ceil(seconds / 3600)} hours`

const setHeaders = (res, result) => {
  res.set({
    "RateLimit-Limit": String(result.limit),
    "RateLimit-Remaining": String(result.remaining),
    "RateLimit-Reset": String(result.retryAfter || 0),
  })
}

// the answer when a limit is reached
export const tooMany = (res, retryAfter, message) => {
  res.set("Retry-After", String(retryAfter))
  return res.status(429).json({ message: `${message} Try again in ${waitText(retryAfter)}.`, retryAfter })
}

// A middleware for one limiter. "keys" gives the key (or a list of keys) of the request, every key needs a free point.
// If the counter store itself breaks, the request is allowed (a broken counter must not take the site down).
export const rateLimit = ({ limiter, keys, message }) => async (req, res, next) => {
  let blocked = null
  let worst = null
  try {
    for (const key of [].concat(keys(req)).filter(Boolean)) {
      const result = await limiter.consume(key)
      if (!result.allowed) {
        blocked = result
        break
      }
      if (!worst || result.remaining < worst.remaining) worst = result
    }
  } catch (err) {
    console.error("rate limit store error, request allowed:", err.message)
    blocked = null
  }
  if (blocked) return tooMany(res, blocked.retryAfter, message)
  if (worst) setHeaders(res, worst)
  next()
}

// ---------- the whole API: one bucket per logged in user (or per ip when there is no valid token)
const requestKey = (req) => {
  const header = req.headers.authorization
  if (header?.startsWith("Bearer")) {
    try {
      const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET)
      return `u:${decoded.userId}`
    } catch (err) {
      // not a valid token, so it counts for the ip
    }
  }
  return `ip:${req.ip}`
}

let logged = false
export const generalLimit = (req, res, next) => {
  // once after a start: shows if the ip is read right behind the proxy (it must be different for different users)
  if (!logged) {
    logged = true
    console.log(`Rate limit sees this client as ${req.ip} (x-forwarded-for: ${req.headers["x-forwarded-for"] || "none"}). If every user shows the same ip, fix TRUST_PROXY.`)
  }
  const result = limiters.general.consume(requestKey(req))
  if (!result.allowed) return tooMany(res, result.retryAfter, "Too many requests.")
  setHeaders(res, result)
  next()
}

// ---------- create / edit / delete / move (needs req.user from protect)
export const writeLimit = rateLimit({
  limiter: limiters.writes,
  keys: (req) => `w:${req.user.userId}`,
  message: "You are doing that too fast.",
})

// ---------- sign up, password reset, token refresh: every request counts
const emailOf = (req) => req.body?.email?.toString().toLowerCase().trim() || ""

export const registerLimit = rateLimit({
  limiter: limiters.register,
  keys: (req) => `register:${req.ip}`,
  message: "Too many sign up attempts.",
})
export const forgotEmailLimit = rateLimit({
  limiter: limiters.forgotPerEmail,
  keys: (req) => emailOf(req) && `forgot:${emailOf(req)}`,
  message: "Too many reset requests for this email.",
})
export const forgotIpLimit = rateLimit({
  limiter: limiters.forgotPerIp,
  keys: (req) => `forgot:${req.ip}`,
  message: "Too many reset requests.",
})
export const resetLimit = rateLimit({
  limiter: limiters.reset,
  keys: (req) => `reset:${req.ip}`,
  message: "Too many attempts.",
})
export const refreshLimit = rateLimit({
  limiter: limiters.refresh,
  keys: (req) => `refresh:${req.ip}`,
  message: "Too many requests.",
})

// ---------- login: only FAILED attempts count, a correct login clears the counter of that email
const loginKeys = (req) => ({ perEmail: `login:${req.ip}:${emailOf(req) || "none"}`, perIp: `login:${req.ip}` })

export const loginGuard = async (req, res, next) => {
  let blocked = null
  try {
    const keys = loginKeys(req)
    const [byEmail, byIp] = await Promise.all([limiters.loginPerEmail.peek(keys.perEmail), limiters.loginPerIp.peek(keys.perIp)])
    blocked = byEmail.remaining <= 0 ? byEmail : byIp.remaining <= 0 ? byIp : null
  } catch (err) {
    console.error("rate limit store error, login allowed:", err.message)
  }
  if (blocked) return tooMany(res, blocked.retryAfter, "Too many failed login attempts.")
  next()
}

export const recordLoginFailure = async (req) => {
  try {
    const keys = loginKeys(req)
    await Promise.all([limiters.loginPerEmail.consume(keys.perEmail), limiters.loginPerIp.consume(keys.perIp)])
  } catch (err) {
    console.error("rate limit store error:", err.message)
  }
}

export const clearLoginFailures = async (req) => {
  try {
    await limiters.loginPerEmail.reset(loginKeys(req).perEmail)
  } catch (err) {
    console.error("rate limit store error:", err.message)
  }
}

// ---------- AI: a short burst limit per user (the daily quota is checked in the AI controller)
export const aiBurstLimit = rateLimit({
  limiter: limiters.aiPerMinute,
  keys: (req) => `ai:${req.user.userId}`,
  message: "Too many AI requests.",
})

// ---------- invites: per workspace, and per person who is invited (needs workspaceAdmin before it)
export const inviteWorkspaceLimit = rateLimit({
  limiter: limiters.invitePerWorkspace,
  keys: (req) => `invite:ws:${req.params.workspaceid}`,
  message: "This workspace sent too many invites.",
})
export const inviteRecipientLimit = rateLimit({
  limiter: limiters.invitePerRecipient,
  keys: (req) => emailOf(req) && `invite:to:${emailOf(req)}`,
  message: "This person already got several invites.",
})
