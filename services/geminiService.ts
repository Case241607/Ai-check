import { AuditReport } from "../types";

export const analyzeUI = async (imageBase64: string, mimeType: string, category: string, language: string): Promise<AuditReport> => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64,
        mimeType,
        category,
        language,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Server Error: ${response.status}`);
    }

    return data as AuditReport;

  } catch (error: any) {
    console.error("Analysis Error:", error);
    throw new Error(error.message || "Failed to connect to the server.");
  }
};