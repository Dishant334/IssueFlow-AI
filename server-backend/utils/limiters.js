import RateLimit from "../models/RateLimit.js"

// Every limiter answers with: { allowed, limit, remaining, retryAfter (seconds), count }

// ---------- 1. fixed window in memory (fast, lost on a restart): for limits where that does not matter
export const memoryWindow = ({ points, windowSeconds }) => {
  const entries = new Map()   // key -> { count, resetAt }

  // remove the finished windows now and then so the map cannot grow forever
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of entries) if (entry.resetAt <= now) entries.delete(key)
  }, 60 * 1000).unref()

  const current = (key) => {
    const entry = entries.get(key)
    return entry && entry.resetAt > Date.now() ? entry : null
  }
  const answer = (entry) => {
    const count = entry?.count || 0
    return {
      allowed: count <= points,
      limit: points,
      count,
      remaining: Math.max(points - count, 0),
      retryAfter: entry ? Math.max(Math.ceil((entry.resetAt - Date.now()) / 1000), 1) : windowSeconds,
    }
  }

  return {
    async consume(key, n = 1) {
      let entry = current(key)
      if (!entry) entry = { count: 0, resetAt: Date.now() + windowSeconds * 1000 }
      entry.count += n
      entries.set(key, entry)
      return answer(entry)
    },
    async peek(key) { return answer(current(key)) },
    async refund(key, n = 1) {
      const entry = current(key)
      if (entry) entry.count = Math.max(entry.count - n, 0)
    },
    async reset(key) { entries.delete(key) },
  }
}

// ---------- 2. fixed window in MongoDB (survives restarts and works with more than one server)
export const mongoWindow = ({ points, windowSeconds }) => {
  const collection = () => RateLimit.collection

  const answer = (doc) => {
    const live = doc && doc.expireAt > new Date()
    const count = live ? doc.count : 0
    return {
      allowed: count <= points,
      limit: points,
      count,
      remaining: Math.max(points - count, 0),
      retryAfter: live ? Math.max(Math.ceil((doc.expireAt - Date.now()) / 1000), 1) : windowSeconds,
    }
  }

  return {
    // one atomic update: start a new window when the old one is over, otherwise add to the count
    async consume(key, n = 1) {
      const now = new Date()
      const expireAt = new Date(now.getTime() + windowSeconds * 1000)
      const doc = await collection().findOneAndUpdate(
        { _id: key },
        [{
          $set: {
            count: { $cond: [{ $gt: ["$expireAt", now] }, { $add: [{ $ifNull: ["$count", 0] }, n] }, n] },
            expireAt: { $cond: [{ $gt: ["$expireAt", now] }, "$expireAt", expireAt] },
          },
        }],
        { upsert: true, returnDocument: "after" }
      )
      return answer(doc)
    },
    async peek(key) { return answer(await collection().findOne({ _id: key })) },
    async refund(key, n = 1) {
      await collection().updateOne({ _id: key, expireAt: { $gt: new Date() }, count: { $gte: n } }, { $inc: { count: -n } })
    },
    async reset(key) { await collection().deleteOne({ _id: key }) },
  }
}

// ---------- 3. token bucket in memory: a burst is allowed, then it is limited to a steady speed
export const tokenBucket = ({ capacity, refillPerSecond }) => {
  const buckets = new Map()   // key -> { tokens, last }

  setInterval(() => {
    const idle = (capacity / refillPerSecond) * 1000 * 2
    const now = Date.now()
    for (const [key, bucket] of buckets) if (now - bucket.last > idle) buckets.delete(key)
  }, 60 * 1000).unref()

  return {
    consume(key) {
      const now = Date.now()
      const bucket = buckets.get(key) || { tokens: capacity, last: now }
      bucket.tokens = Math.min(capacity, bucket.tokens + ((now - bucket.last) / 1000) * refillPerSecond)
      bucket.last = now

      if (bucket.tokens < 1) {
        buckets.set(key, bucket)
        return { allowed: false, limit: capacity, remaining: 0, retryAfter: Math.ceil((1 - bucket.tokens) / refillPerSecond) }
      }
      bucket.tokens -= 1
      buckets.set(key, bucket)
      return { allowed: true, limit: capacity, remaining: Math.floor(bucket.tokens), retryAfter: 0 }
    },
  }
}
