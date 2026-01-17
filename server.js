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
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] 📨 Received analysis request`);
  
  try {  
    const { imageBase64, mimeType, category, language } = req.body;  
    
    // 1. Check Input
    if (!imageBase64 || !mimeType || !category) {  
      console.warn('⚠️ Request missing fields');
      return res.status(400).json({  
        error: 'Missing required fields: imageBase64, mimeType, category'  
      });  
    }  

    // 2. Check API Key specifically for this request
    const apiKey = process.env.API_KEY;  
    if (!apiKey) {  
      console.error('❌ CRITICAL ERROR: API_KEY is missing in environment during request processing!');  
      return res.status(500).json({  
        error: language === 'zh'  
          ? '服务器配置错误：未找到 API Key。请在部署平台检查环境变量。'  
          : 'Server Configuration Error: API_KEY missing. Please check deployment settings.'  
      });  
    }  

    console.log(`🔑 API Key check passed (Length: ${apiKey.length})`);

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
    
    console.log(`🤖 Calling Gemini Model: gemini-3-pro-preview`);
    console.log(`📝 Parameters: Category=[${category}], Language=[${targetLang}]`);

    // Call Gemini API
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
    
    const duration = (Date.now() - startTime) / 1000;
    console.log(`✅ Gemini response received successfully in ${duration}s`);

    if (!text) {  
      console.error('⚠️ Gemini returned empty response text');
      return res.status(500).json({  
        error: language === 'zh' ? 'AI 响应内容为空' : 'AI response is empty'  
      });  
    }  

    const result = JSON.parse(text);  
    res.json(result);  

  } catch (error) {  
    console.error('❌ API Processing Error:', error);  
    let errorMessage = 'Analysis failed';  
    
    // Enhanced error mapping for debugging
    if (error.message?.includes('403')) {  
      console.error('🔑 403 Forbidden: Check if API Key is valid and has access to gemini-3-pro-preview');
      errorMessage = req.body.language === 'zh'  
        ? 'API 权限验证失败 (403)。请检查 API Key 是否有效，以及是否开通了相关模型权限。'  
        : 'API Forbidden (403). Check if API Key is valid and has access to the model.';  
    } else if (error.message?.includes('400')) {  
      console.error('📉 400 Bad Request: Image might be malformed or prompt issues');
      errorMessage = req.body.language === 'zh'  
        ? '请求被拒绝 (400)。可能是图片格式问题或 API Key 无效。'  
        : 'Invalid request (400). Check image format or API Key.';  
    } else if (error.message?.includes('429')) {  
      console.error('⏳ 429 Too Many Requests: Rate limit exceeded');
      errorMessage = req.body.language === 'zh'  
        ? '请求过于频繁 (429)。请稍后重试。'  
        : 'Too many requests (429). Please try again later.';  
    } else if (error.message?.includes('503') || error.message?.includes('504')) {
        console.error('⏱️ 503/504 Timeout: Model took too long');
        errorMessage = req.body.language === 'zh'
        ? '服务器处理超时，Gemini Pro 需要更多时间思考，请重试。'
        : 'Service timed out. Gemini Pro needs more time to think.';
    }
    
    res.status(500).json({ error: errorMessage, debug: error.message });  
  }  
});  

// Serve frontend for all other routes  
app.get('*', (req, res) => {  
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));  
});  

app.listen(PORT, () => {  
  console.log(`🚀 Server running on port ${PORT}`);
  
  // STARTUP CHECK for API KEY
  const key = process.env.API_KEY;
  if (!key) {
    console.error("_________________________________________________________________");
    console.error("❌ CRITICAL: API_KEY environment variable is NOT SET.");
    console.error("   Please go to Zeabur -> Settings -> Variables and add API_KEY.");
    console.error("_________________________________________________________________");
  } else {
    console.log("_________________________________________________________________");
    console.log(`✅ Startup Check: API_KEY is set (Length: ${key.length} chars).`);
    console.log(`   Server is ready to accept requests.`);
    console.log("_________________________________________________________________");
  }
});