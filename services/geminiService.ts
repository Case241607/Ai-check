
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { AuditReport } from "../types";

export const analyzeUI = async (imageBase64: string, mimeType: string, category: string, language: string): Promise<AuditReport> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // Map language codes to human-readable names for the AI prompt
  const langMap: Record<string, string> = {
    zh: 'Simplified Chinese (简体中文)',
    en: 'English',
    ja: 'Japanese',
    ko: 'Korean',
    es: 'Spanish'
  };

  const targetLang = langMap[language] || 'Simplified Chinese';

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: imageBase64,
          },
        },
        {
          text: `Design Category: [${category}].\n\nAnalyze the image based on the specific "Lens" and taboos for this category as defined in the system instructions.\n\nIMPORTANT: The output JSON content MUST be written in ${targetLang}.`
        }
      ]
    },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          audit_perspective: { type: Type.STRING },
          critical_issues: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["title", "description"]
            }
          },
          improvement_suggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["title", "description"]
            }
          },
          positive_elements: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["title", "description"]
            }
          }
        },
        required: ["critical_issues", "improvement_suggestions", "positive_elements"]
      }
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("AI response is empty");
  }

  try {
    return JSON.parse(text) as AuditReport;
  } catch (e) {
    console.error("JSON Parse Error:", text);
    throw new Error("Failed to parse AI response. Please try again.");
  }
};
