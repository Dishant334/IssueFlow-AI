import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({
    apiKey:process.env.GEMINI_API_KEY
}
);

// Model used by all AI features. Override with GEMINI_MODEL env var if needed.
export const AI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

// Groq is the free backup: it is only asked when Gemini fails (busy, over its limit, or a bad key).
export const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

const geminiText = (response) =>
  response?.text || response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

const askGroq = async (prompt) => {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({ model: GROQ_MODEL, messages: [{ role: "user", content: prompt }] }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`Groq ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content || "";
};

// Asks Gemini first, then Groq. If both fail, the Gemini error is thrown (the controller reads its status).
export const generateText = async (prompt) => {
  try {
    const text = geminiText(await ai.models.generateContent({ model: AI_MODEL, contents: prompt }));
    if (text) return text;
    throw new Error("Gemini returned an empty answer");
  } catch (geminiErr) {
    if (!process.env.GROQ_API_KEY) throw geminiErr;
    console.error("Gemini failed, trying Groq:", geminiErr?.status, geminiErr?.message?.slice(0, 150));
    try {
      return await askGroq(prompt);
    } catch (groqErr) {
      console.error("Groq failed too:", groqErr.message);
      throw geminiErr;
    }
  }
};
