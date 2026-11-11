import { trustProxyHops } from "../config/rateLimits.js"

// The ip of the user for the sockets (Express does the same for normal requests with "trust proxy").
// Behind a proxy the real ip is in x-forwarded-for. Only the entry added by OUR proxy is trusted: counted from the
// right, so a user cannot fake his ip by sending his own x-forwarded-for header.
export const socketIp = (socket) => {
  const forwarded = socket.handshake.headers["x-forwarded-for"]
  if (trustProxyHops > 0 && forwarded) {
    const parts = forwarded.split(",").map((p) => p.trim()).filter(Boolean)
    const ip = parts[parts.length - trustProxyHops]
    if (ip) return ip
  }
  return socket.handshake.address
}
