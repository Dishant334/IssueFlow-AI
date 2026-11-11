import { limiters } from "./rateLimiters.js"

// A Gmail account is stopped by Google when it sends too many mails in a day, so all mails of the app
// (invites and password resets) share one daily budget.
const today = () => new Date().toISOString().slice(0, 10)

export const consumeMailQuota = async () => {
  let allowed = true
  try {
    const result = await limiters.mailDaily.consume(`mail:${today()}`)
    if (!result.allowed) {
      await limiters.mailDaily.refund(`mail:${today()}`)
      allowed = false
    }
  } catch (err) {
    console.error("mail quota store error, mail allowed:", err.message)   // if the counter is broken do not block mails
  }
  if (!allowed) {
    const error = new Error("The daily email limit is reached")
    error.code = "MAIL_LIMIT"
    throw error
  }
}
