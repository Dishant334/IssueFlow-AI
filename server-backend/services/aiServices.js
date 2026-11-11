import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({
    apiKey:process.env.GEMINI_API_KEY
}
);

// Model used by all AI features. Override with GEMINI_MODEL env var if needed.
export const AI_MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
