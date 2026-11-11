import { limiters } from "./rateLimiters.js"
import { limits } from "../config/rateLimits.js"

// The free Gemini key allows a fixed number of requests per day for the WHOLE app, counted by Google's day
// (Pacific time). So every AI request takes one point from the user's daily allowance AND from the shared pool.
// The counters are in MongoDB, because a restart of the server must not give the day back.

const pacificDay = () => new Date().toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" })

export const secondsUntilReset = () => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles", hour: "numeric", minute: "numeric", second: "numeric", hour12: false,
  }).formatToParts(new Date())
  const get = (type) => Number(parts.find((p) => p.type === type).value)
  const passed = (get("hour") % 24) * 3600 + get("minute") * 60 + get("second")
  return Math.max(86400 - passed, 1)
}

const userKey = (userId) => `ai:${pacificDay()}:user:${userId}`
const globalKey = () => `ai:${pacificDay()}:all`

// take one point from both, or none
export const consumeAiQuota = async (userId) => {
  const user = await limiters.aiUserDaily.consume(userKey(userId))
  if (!user.allowed) {
    await limiters.aiUserDaily.refund(userKey(userId))
    return { allowed: false, reason: "user", retryAfter: secondsUntilReset() }
  }
  const all = await limiters.aiGlobalDaily.consume(globalKey())
  if (!all.allowed) {
    await limiters.aiGlobalDaily.refund(globalKey())
    await limiters.aiUserDaily.refund(userKey(userId))
    return { allowed: false, reason: "global", retryAfter: secondsUntilReset() }
  }
  return { allowed: true }
}

// the request never counted at Google (a temporary error), so give the point back
export const refundAiQuota = async (userId) => {
  await limiters.aiUserDaily.refund(userKey(userId))
  await limiters.aiGlobalDaily.refund(globalKey())
}

// Google said the daily limit is reached, so the pool is empty for the rest of the day (even if our own count is lower)
export const markAiExhausted = async () => {
  const pool = await limiters.aiGlobalDaily.peek(globalKey())
  if (pool.remaining > 0) await limiters.aiGlobalDaily.consume(globalKey(), pool.remaining)
}

// what the frontend shows ("2 AI uses left today")
export const getAiQuota = async (userId) => {
  const [user, all] = await Promise.all([
    limiters.aiUserDaily.peek(userKey(userId)),
    limiters.aiGlobalDaily.peek(globalKey()),
  ])
  return {
    remaining: Math.min(user.remaining, all.remaining),
    userRemaining: user.remaining,
    globalRemaining: all.remaining,
    userLimit: limits.aiUserDaily,
    globalLimit: limits.aiGlobalDaily,
    resetsInSeconds: secondsUntilReset(),
  }
}
