// Frontend origins that may call the API and connect to the sockets.
// ALLOWED_ORIGINS (comma separated) can add more. HOST and CLIENT_URL are also accepted, so old settings keep working.
const clean = (url) => url.trim().replace(/\/+$/, "")

export const allowedOrigins = [
  "http://localhost:5173",
  "https://issueflow-nine.vercel.app",
  ...[process.env.ALLOWED_ORIGINS, process.env.HOST, process.env.CLIENT_URL]
    .filter(Boolean)
    .flatMap((value) => value.split(",")),
]
  .map(clean)
  .filter((url, i, all) => url && all.indexOf(url) === i)
