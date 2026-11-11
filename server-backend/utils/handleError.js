// Sends the right error to the client. A bad value or a bad id is the user's mistake (400), a duplicate is a
// conflict (409), and everything else is a server problem (500) whose details stay in the server log only.
export const sendError = (res, err, fallback = "Something went wrong") => {
  if (err?.name === "ValidationError") {
    const first = Object.values(err.errors || {})[0]
    return res.status(400).json({ message: first?.message || "Invalid data" })
  }
  if (err?.name === "CastError") {
    return res.status(400).json({ message: "Invalid id or value" })
  }
  if (err?.code === 11000) {
    return res.status(409).json({ message: "This already exists" })
  }
  console.error(err)
  return res.status(500).json({ message: fallback })
}
