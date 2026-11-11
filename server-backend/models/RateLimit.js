import mongoose from 'mongoose'

// One document per counter, used for the limits that must survive a restart (login, register, AI quota, mails ...).
// Render's free server goes to sleep and restarts, so these counters cannot live in memory.
const rateLimitSchema = new mongoose.Schema({
    _id: String,                                    // the key, for example "login:1.2.3.4:john@mail.com"
    count: { type: Number, default: 0 },
    expireAt: { type: Date, required: true },       // end of the window, MongoDB removes the document after it
}, { versionKey: false })

rateLimitSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 })

const RateLimit = mongoose.model('RateLimit', rateLimitSchema)

export default RateLimit
