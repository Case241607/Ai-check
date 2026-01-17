import { AuditReport } from "../types";

export const analyzeUI = async (imageBase64: string, mimeType: string, category: string, language: string): Promise<AuditReport> => {
  const controller = new AbortController();
  // INCREASED TIMEOUT to 180 seconds (3 minutes) for Gemini 3 Pro
  const timeoutId = setTimeout(() => controller.abort(), 180000); 

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
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Server Error: ${response.status}`);
    }

    return data as AuditReport;

  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error("Analysis Error:", error);
    
    if (error.name === 'AbortError') {
      throw new Error("Analysis timed out. Gemini Pro is taking longer than 3 minutes to respond.");
    }
    
    throw new Error(error.message || "Failed to connect to the server.");
  }
};