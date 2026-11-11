import { limits } from "../config/rateLimits.js"
import { memoryWindow, mongoWindow, tokenBucket } from "../utils/limiters.js"

const TWO_DAYS = 2 * 24 * 60 * 60   // the day is part of the key of the daily limits, so each day starts a new counter

// "mongo" = survives a restart (Render sleeps and restarts the free server), "memory" = fast but forgotten on a restart
export const limiters = {
  general: tokenBucket(limits.general),
  writes: memoryWindow(limits.writes),

  loginPerEmail: mongoWindow(limits.loginPerEmail),
  loginPerIp: mongoWindow(limits.loginPerIp),
  register: mongoWindow(limits.register),
  forgotPerEmail: mongoWindow(limits.forgotPerEmail),
  forgotPerIp: mongoWindow(limits.forgotPerIp),
  reset: mongoWindow(limits.reset),
  refresh: mongoWindow(limits.refresh),

  aiPerMinute: memoryWindow(limits.aiPerMinute),
  aiUserDaily: mongoWindow({ points: limits.aiUserDaily, windowSeconds: TWO_DAYS }),
  aiGlobalDaily: mongoWindow({ points: limits.aiGlobalDaily, windowSeconds: TWO_DAYS }),

  invitePerWorkspace: mongoWindow(limits.invitePerWorkspace),
  invitePerRecipient: mongoWindow(limits.invitePerRecipient),
  mailDaily: mongoWindow({ points: limits.mailDaily, windowSeconds: TWO_DAYS }),

  socketConnectPerIp: memoryWindow(limits.socketConnectPerIp),
  socketJoinPerSocket: memoryWindow(limits.socketJoinPerSocket),
}
