// All the rate limit numbers of the app in one place. Change them here (or with the env variables that are named below).
// "points" = how many requests are allowed inside "windowSeconds".
const number = (name, fallback) => {
  const value = Number(process.env[name])
  return Number.isFinite(value) && value > 0 ? value : fallback
}

const MINUTE = 60
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export const limits = {
  // the whole API: a token bucket, so a page load (many requests at once) is fine but a flood is not
  general: {
    capacity: number('RATE_GENERAL_BURST', 100),                         // requests that can come at once
    refillPerSecond: number('RATE_GENERAL_PER_MINUTE', 300) / MINUTE,    // and how fast the bucket fills again
  },
  writes: { points: 60, windowSeconds: MINUTE },                          // create / edit / delete / move, per user

  // login: only FAILED attempts count. One account from one ip, and one ip in total
  loginPerEmail: { points: 5, windowSeconds: 15 * MINUTE },
  loginPerIp: { points: 30, windowSeconds: 15 * MINUTE },
  register: { points: 5, windowSeconds: HOUR },                           // per ip
  forgotPerEmail: { points: 3, windowSeconds: HOUR },
  forgotPerIp: { points: 10, windowSeconds: HOUR },
  reset: { points: 10, windowSeconds: 15 * MINUTE },                      // per ip
  refresh: { points: 30, windowSeconds: 15 * MINUTE },                    // per ip

  // AI: the free Gemini key allows 20 requests a day for the whole app, so the day is shared out
  aiPerMinute: { points: 5, windowSeconds: MINUTE },                      // per user, stops hammering the button
  aiUserDaily: number('AI_USER_DAILY_LIMIT', 3),                          // per user per day
  aiGlobalDaily: number('AI_DAILY_LIMIT', 20),                            // all users together, set it to the limit of your Gemini key

  // mails
  invitePerWorkspace: { points: 20, windowSeconds: HOUR },
  invitePerRecipient: { points: 3, windowSeconds: DAY },                  // one person cannot be flooded with invites
  mailDaily: number('MAIL_DAILY_LIMIT', 300),                             // all mails of the app, a Gmail account stops at about 500 a day

  // sockets
  socketConnectPerIp: { points: 20, windowSeconds: MINUTE },
  socketJoinPerSocket: { points: 30, windowSeconds: MINUTE },
}

// how many proxies are in front of the server (Render has 1). 0 when you run it on your own computer without a proxy
export const trustProxyHops = Number.isFinite(Number(process.env.TRUST_PROXY)) && process.env.TRUST_PROXY !== undefined
  ? Number(process.env.TRUST_PROXY)
  : 1
