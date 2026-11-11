import crypto from "node:crypto";
import mongoose from "mongoose";
import Comment from "../models/Comments.js";
import { Task } from "../models/Tasks.js";
import Project from "../models/Projects.js";
import Workspace from "../models/Workspace.js";
import { ai, AI_MODEL } from "../services/aiServices.js";
import { consumeAiQuota, getAiQuota, markAiExhausted, refundAiQuota, secondsUntilReset } from "../services/aiQuota.js";
import { tooMany } from "../authMiddleWare/rateLimit.js";
import { get, set } from "../utils/cache.js";

// the real error (it can contain details of the AI service) stays in the server log
const aiFailed = (res, err) => {
  console.error("AI ERROR:", err?.message);
  return res.status(502).json({ message: "The AI service is not available right now. Please try again in a moment." });
};

const getText = (response) =>
  response?.text || response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

// Asks Gemini. The free key has a small daily limit for the whole app (see config/rateLimits.js), so every question
// takes a point from the user's allowance and from the shared pool first.
// Returns the text, or null when it has already answered the user (limit reached or error).
const askGemini = async (req, res, prompt) => {
  const { userId } = req.user;

  // The same prompt (same title, notes or comments) gets the same answer, so it is not asked again and costs no quota.
  // When a comment is added the prompt changes, so a summary is made again by itself.
  const cacheKey = "ai:" + crypto.createHash("sha256").update(prompt).digest("hex");
  const known = get(cacheKey);
  if (known !== undefined) {
    res.locals.fromCache = true;
    return known;
  }

  const quota = await consumeAiQuota(userId);
  if (!quota.allowed) {
    tooMany(
      res,
      quota.retryAfter,
      quota.reason === "user" ? "You used all your AI requests for today." : "The shared AI limit for today is used up."
    );
    return null;
  }

  try {
    const response = await ai.models.generateContent({ model: AI_MODEL, contents: prompt });
    const text = getText(response);
    if (text) set(cacheKey, text, 24 * 60 * 60);   // only a real answer is kept (not an error, not an empty answer)
    return text;
  } catch (err) {
    console.error("AI ERROR:", err?.status, err?.message);

    if (err?.status === 429 && /per.?day/i.test(err?.message || "")) {
      await markAiExhausted();   // Google says the daily limit is reached: the pool is empty for the rest of the day
      tooMany(res, secondsUntilReset(), "The AI limit for today is used up.");
    } else if (err?.status === 429) {
      await refundAiQuota(userId);   // only a per minute limit: it did not count for the day
      tooMany(res, 60, "The AI is busy.");
    } else {
      await refundAiQuota(userId);   // a temporary error, the request did not count
      res.status(502).json({ message: "The AI service is not available right now. Please try again in a moment." });
    }
    return null;
  }
};

// how many AI uses are left today (the frontend shows it next to the AI buttons)
export const quota = async (req, res) => {
  try {
    return res.status(200).json(await getAiQuota(req.user.userId));
  } catch (err) {
    return aiFailed(res, err);
  }
};

// removes markdown and labels (like "Title:" or "Description:") the model sometimes adds
// and keeps the text inside the 200 character limit of the task description
const cleanDescription = (text) => {
  let clean = text
    .replace(/\*\*|__|`/g, "")
    .replace(/^\s*title\s*:.*$/gim, "")
    .replace(/^\s*description\s*:\s*/gim, "")
    .replace(/^[\s>*#-]+/gm, "")
    .replace(/\s+/g, " ")
    .replace(/^["“']+|["”']+$/g, "")
    .trim();

  if (clean.length > 200) {
    const cut = clean.slice(0, 200);
    const stop = cut.lastIndexOf(". ");
    clean = stop > 80 ? cut.slice(0, stop + 1) : cut.slice(0, cut.lastIndexOf(" ")).trim();
  }
  return clean;
};

export const generateDescription = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Please provide a valid title" });
    }

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return res.status(400).json({ message: "Please provide a valid title" });
    }

    const trimmedDesc = description?.trim();

    const prompt = `You write the description for a task in a project management app.
Use the task title, and the rough notes if the user already typed some, to write a clear description.

Rules:
- Write 1 or 2 plain sentences, 180 characters at most.
- Say what has to be done and what a good result looks like.
- Do not repeat the title word for word.
- Do not make up facts, names or numbers that are not in the input.
- No markdown, no bullet points, no quotes, and no labels like "Title:" or "Description:".
- Reply with only the description text.

Task title: ${trimmedTitle}
Rough notes: ${trimmedDesc || "none"}`;

    const raw = await askGemini(req, res, prompt);
    if (raw === null) return;
    const text = cleanDescription(raw);

    if (!text) {
      return res
        .status(500)
        .json({ message: "AI returned empty response" });
    }

    return res.status(200).json({ description: text, quota: await getAiQuota(req.user.userId), cached: !!res.locals.fromCache });
  } catch (err) {
  return aiFailed(res, err);
}
};

export const suggestPriority = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Please provide a valid title" });
    }

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return res.status(400).json({ message: "Please provide a valid title" });
    }

    const trimmedDesc = description?.trim();

    const prompt = `You decide the priority of a task in a project management app.

HIGH: something is broken for users, it blocks other work, it is a security or data problem, or it has a hard deadline.
MEDIUM: an important feature or fix that should be done soon, but nothing is blocked.
LOW: a nice to have, a cosmetic change, a cleanup or a small improvement.

Reply with exactly one word: LOW, MEDIUM or HIGH. No punctuation and no explanation.

Task title: ${trimmedTitle}
Task description: ${trimmedDesc || "none"}`;

    const text = await askGemini(req, res, prompt);
    if (text === null) return;

    if (!text) {
      return res
        .status(500)
        .json({ message: "AI returned empty response" });
    }

    // the answer can come back as "**HIGH**" or "High." so find the word inside it
    const match = text.toUpperCase().match(/\b(LOW|MEDIUM|HIGH)\b/);
    const result = match ? match[1] : "MEDIUM";

    return res.status(200).json({ priority: result, quota: await getAiQuota(req.user.userId), cached: !!res.locals.fromCache });
  } catch (err) {
      return aiFailed(res, err);
  }
};

export const summarizeComments = async (req, res) => {
  try {
    const { issueId } = req.body;

    if (!issueId || !mongoose.isValidObjectId(issueId)) {
      return res.status(400).json({ message: "Issue ID is required" });
    }

    // same rule as the task routes: a workspace member who is in the project (or a workspace admin)
    const task = await Task.findById(issueId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const { userId } = req.user;
    const workspace = await Workspace.findById(task.workspace);
    const workspaceMember = workspace?.members.find((m) => m.user.toString() === userId.toString());
    if (!workspaceMember) return res.status(403).json({ message: "Not allowed" });

    if (workspaceMember.role !== "admin") {
      const project = await Project.findById(task.project);
      const inProject = project?.members.some((m) => m.user.toString() === userId.toString());
      if (!inProject) return res.status(403).json({ message: "Not allowed" });
    }

    const comments = await Comment.find({ taskId: issueId });

    if (!comments.length) {
      return res
        .status(200)
        .json({ summary: "No comments to summarize." });
    }

    const commentText = comments
      .map((c, i) => `Comment ${i + 1}: ${c.text}`)
      .join("\n");

    const prompt = `You are an AI assistant for a project management tool. Summarize the following issue comments into a short, clear summary. Rules: Keep it concise (3-5 lines). Highlight key decisions, concerns, or progress. Avoid unnecessary details. Use simple professional language. Comments: ${commentText}`;

    const text = await askGemini(req, res, prompt);
    if (text === null) return;

    if (!text) {
      return res
        .status(500)
        .json({ message: "AI returned empty response" });
    }

    return res.status(200).json({ summary: text, quota: await getAiQuota(req.user.userId), cached: !!res.locals.fromCache });
  } catch (err) {
      return aiFailed(res, err);
  }
};