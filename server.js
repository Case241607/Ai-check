import express from 'express';  
import cors from 'cors';  
import { GoogleGenAI, Type } from '@google/genai';  
import path from 'path';  
import { fileURLToPath } from 'url';  
import fs from 'fs';  

const __filename = fileURLToPath(import.meta.url);  
const __dirname = path.dirname(__filename);  
const app = express();  
const PORT = process.env.PORT || 8080;  

// Middleware  
app.use(cors());  
app.use(express.json({ limit: '50mb' }));  
app.use(express.urlencoded({ limit: '50mb' }));  

// Serve static files from dist folder  
app.use(express.static(path.join(__dirname, 'dist')));  

// System instruction for Gemini  
const SYSTEM_INSTRUCTION = `You are an expert UI/UX design auditor with deep knowledge across multiple design disciplines. Your role is to analyze UI screenshots from different perspectives and provide actionable, specific feedback.  
You will receive:
1. A UI screenshot image
2. A specific design category/lens to analyze through  
Based on the category, apply the appropriate "lens" and identify issues according to that perspective's specific taboos and best practices.  
IMPORTANT RULES:
- Provide SPECIFIC, ACTIONABLE feedback with concrete examples from the image
- Avoid generic statements
- Focus on the assigned category's perspective
- Be constructive and professional
- Output MUST be valid JSON matching the schema
- All text content MUST be in the specified language  
DESIGN CATEGORIES & THEIR LENSES:
1. **Accessibility (无障碍设计)**  
   - Lens: Can users with disabilities navigate and use this interface?  
   - Taboos: Low contrast, missing alt text, keyboard navigation issues, color-only information, small touch targets  
   - Focus: WCAG compliance, screen reader compatibility, keyboard navigation
2. **Visual Design (视觉设计)**  
   - Lens: Is the visual hierarchy, typography, and color palette effective?  
   - Taboos: Poor hierarchy, inconsistent spacing, clashing colors, illegible fonts, visual clutter  
   - Focus: Aesthetics, consistency, visual balance, color theory
3. **Information Architecture (信息架构)**  
   - Lens: Is the content organized logically and findable?  
   - Taboos: Unclear navigation, poor categorization, hidden important info, confusing structure  
   - Focus: Navigation clarity, content organization, findability
4. **Interaction Design (交互设计)**  
   - Lens: Are interactions intuitive and responsive?  
   - Taboos: Unclear affordances, poor feedback, inconsistent interactions, confusing state changes  
   - Focus: User feedback, affordances, consistency, responsiveness
5. **Mobile Experience (移动体验)**  
   - Lens: Is this optimized for mobile devices?  
   - Taboos: Not responsive, too small touch targets, horizontal scrolling, poor mobile navigation  
   - Focus: Responsiveness, touch-friendly design, mobile-first approach
6. **Performance & Loading (性能与加载)**  
   - Lens: Does the interface feel fast and responsive?  
   - Taboos: Slow loading, janky animations, unresponsive buttons, poor perceived performance  
   - Focus: Loading states, animation smoothness, perceived performance
7. **Emotional Design (情感设计)**  
   - Lens: Does the interface evoke the right emotions and build trust?  
   - Taboos: Cold/impersonal feel, inconsistent tone, lack of personality, trust-breaking elements  
   - Focus: Brand personality, emotional resonance, trust signals
8. **Conversion Optimization (转化优化)**  
   - Lens: Does the interface guide users toward desired actions?  
   - Taboos: Unclear CTAs, friction in conversion flow, poor form design, distraction from goals  
   - Focus: CTA clarity, conversion funnel, form optimization, persuasion  
Return a JSON object with this exact structure:  
{  
  "audit_perspective": "The design category being analyzed",  
  "critical_issues": [  
    {  
      "title": "Specific issue title",  
      "description": "Detailed explanation with specific examples from the image"  
    }  
  ],  
  "improvement_suggestions": [  
    {  
      "title": "Suggestion title",  
      "description": "How to improve with specific recommendations"  
    }  
  ],  
  "positive_elements": [  
    {  
      "title": "What's working well",  
      "description": "Why this is effective and should be maintained"  
    }  
  ]  
}`;  

// API endpoint for UI analysis  
app.post('/api/analyze', async (req, res) => {  
  try {  
    const { imageBase64, mimeType, category, language } = req.body;  
    
    // Validate inputs  
    if (!imageBase64 || !mimeType || !category) {  
      return res.status(400).json({  
        error: 'Missing required fields: imageBase64, mimeType, category'  
      });  
    }  

    // Get API key from environment  
    const apiKey = process.env.API_KEY;  
    if (!apiKey) {  
      console.error('API_KEY not found in environment variables');  
      return res.status(500).json({  
        error: language === 'zh'  
          ? '服务器未配置 API Key。请在 Zeabur 环境变量中设置 API_KEY。'  
          : 'Server API Key not configured. Please set API_KEY in environment variables.'  
      });  
    }  

    // Initialize Gemini AI  
    const ai = new GoogleGenAI({ apiKey });  
    
    // Map language codes  
    const langMap = {  
      zh: 'Simplified Chinese (简体中文)',  
      en: 'English',  
      ja: 'Japanese',  
      ko: 'Korean',  
      es: 'Spanish'  
    };  
    const targetLang = langMap[language] || 'Simplified Chinese';  
    
    // Call Gemini API  
    // Using gemini-2.0-flash as requested in server code
    const response = await ai.models.generateContent({  
      model: 'gemini-2.0-flash',  
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
        responseMimeType: 'application/json',  
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
                required: ['title', 'description']  
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
                required: ['title', 'description']  
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
                required: ['title', 'description']  
              }  
            }  
          },  
          required: ['critical_issues', 'improvement_suggestions', 'positive_elements']  
        }  
      },  
    });  

    const text = response.text;  
    if (!text) {  
      return res.status(500).json({  
        error: language === 'zh' ? 'AI 响应为空' : 'AI response is empty'  
      });  
    }  

    const result = JSON.parse(text);  
    res.json(result);  

  } catch (error) {  
    console.error('API Error:', error);  
    let errorMessage = 'Analysis failed';  
    
    if (error.message?.includes('403')) {  
      errorMessage = req.body.language === 'zh'  
        ? 'API 调用被拒绝 (403)。请检查 API Key 是否有效。'  
        : 'API request forbidden (403). Please check your API Key.';  
    } else if (error.message?.includes('400')) {  
      errorMessage = req.body.language === 'zh'  
        ? '请求无效 (400)。API Key 可能无效。'  
        : 'Invalid request (400). Your API Key might be invalid.';  
    } else if (error.message?.includes('429')) {  
      errorMessage = req.body.language === 'zh'  
        ? '请求过于频繁，请稍后重试。'  
        : 'Too many requests. Please try again later.';  
    }  
    
    res.status(500).json({ error: errorMessage });  
  }  
});  

// Serve frontend for all other routes  
app.get('*', (req, res) => {  
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));  
});  

app.listen(PORT, () => {  
  console.log(`🚀 Server running on port ${PORT}`);  
  console.log(`📱 Frontend: http://localhost:${PORT}`);  
  console.log(`🔌 API: http://localhost:${PORT}/api/analyze`);  
});