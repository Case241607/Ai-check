import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { AuditReport } from "../types";

export const analyzeUI = async (imageBase64: string, mimeType: string, category: string, language: string): Promise<AuditReport> => {
  // @ts-ignore
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Map language codes to human-readable names for the AI prompt
  const langMap: Record<string, string> = {
    zh: 'Simplified Chinese (简体中文)',
    en: 'English',
    ja: 'Japanese',
    ko: 'Korean',
    es: 'Spanish'
  };

  const targetLang = langMap[language] || 'Simplified Chinese';

  try {
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

    return JSON.parse(text) as AuditReport;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Handle Google Generative AI specific errors
    if (error.message?.includes('403') || error.toString().includes('403')) {
      throw new Error(
        language === 'zh'
          ? "API 调用被拒绝 (403)。这是因为您开启了 API Key 限制。请登录 Google AI Studio，在 'Client Restrictions' 中将您的 Zeabur 域名添加到允许列表。"
          : "API request forbidden (403). Please go to Google AI Studio and add your Zeabur domain to the API Key allowed list."
      );
    }

    if (error.message?.includes('400') || error.toString().includes('400')) {
       throw new Error(
        language === 'zh'
          ? "请求无效 (400)。可能是 API Key 无效或请求格式有误。"
          : "Invalid request (400). Your API Key might be invalid."
      );
    }

    throw new Error(
      language === 'zh'
        ? "分析失败，请稍后重试。详细错误已记录在控制台。"
        : "Analysis failed. Please try again later."
    );
  }
};