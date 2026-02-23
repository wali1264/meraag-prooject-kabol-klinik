import { GoogleGenAI } from "@google/genai";

// Initialize Gemini API with the key from environment variables
// This is safe to use in client-side code because the key is injected by the platform
// and restricted to this application's domain.
export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
