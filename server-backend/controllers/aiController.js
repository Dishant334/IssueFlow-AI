import Comment from "../models/Comments.js";
import { ai } from "../services/aiServices.js";

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

    const prompt = `You are an AI assistant for a project management tool. Convert the following rough issue input into a short and clear issue description. Keep it concise (4-6 lines). Use simple and professional language. Do not over-explain. Avoid unnecessary assumptions. Input: title: ${trimmedTitle} description: ${trimmedDesc || ""}`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    const text =
      response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!text) {
      return res
        .status(500)
        .json({ message: "AI returned empty response" });
    }

    return res.status(200).json({ description: text });
  } catch (err) {
    return res.status(500).json({ message: "AI service failed" });
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
    if (!trimmedDesc) {
      return res
        .status(400)
        .json({ message: "Please enter a valid description" });
    }

    const prompt = `You are an AI assistant for a project management tool. Analyze the issue based on its title and description and suggest a priority level. Rules: Respond with only one word: LOW, MEDIUM, or HIGH. Do not explain your answer. Low: minor issue, Medium: important issue but not blocking, High: critical bug, blocking issue, or security issue. Input: title: ${trimmedTitle}, description: ${trimmedDesc}`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    const text =
      response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!text) {
      return res
        .status(500)
        .json({ message: "AI returned empty response" });
    }

    let result = text.trim().toUpperCase();

    if (!["LOW", "MEDIUM", "HIGH"].includes(result)) {
      result = "MEDIUM";
    }

    return res.status(200).json({ priority: result });
  } catch (err) {
    return res.status(500).json({ message: "AI service failed" });
  }
};

export const summarizeComments = async (req, res) => {
  try {
    const { issueId } = req.body;

    if (!issueId) {
      return res.status(400).json({ message: "Issue ID is required" });
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

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    const text =
      response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!text) {
      return res
        .status(500)
        .json({ message: "AI returned empty response" });
    }

    return res.status(200).json({ summary: text });
  } catch (err) {
    return res.status(500).json({ message: "AI service failed" });
  }
};