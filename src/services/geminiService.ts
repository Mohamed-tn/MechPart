import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateDescription = async (partName: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Write a professional marketplace description for a used mechanical part named: ${partName}. Include technical details and condition assessment.`,
  });
  return response.text;
};
