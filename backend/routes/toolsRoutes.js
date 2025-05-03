import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { generateText, summarizeText, translateText, fixGrammar } from '../utils/openai.js';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

// Initialize OpenAI with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const router = express.Router();

// Debug logging
console.log('Initializing OpenAI client...');
console.log('API Key exists:', !!process.env.OPENAI_API_KEY);
console.log('API Key starts with:', process.env.OPENAI_API_KEY?.substring(0, 7));
console.log('API Key length:', process.env.OPENAI_API_KEY?.length);

if (!process.env.OPENAI_API_KEY) {
  console.error('OpenAI API key is missing! Please check your .env file');
  process.exit(1);
}

// -------------------- UNPROTECTED ROUTES FOR TESTING --------------------
// These routes don't require authentication and are useful for development/testing

// POST /unprotected/summarizer
router.post('/unprotected/summarizer', async (req, res) => {
  try {
    const { text, language, length, style } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required.' });
    }

    const normalized = text.toLowerCase();
    const forbiddenWords = ['سکس', 'سکسی', 'کودک', 'زیر ۱۸', 'زیر18', 'rape', 'child', 'sex', 'underage'];

    if (forbiddenWords.some(word => normalized.includes(word))) {
      const localizedError = {
        fa: '❌ این درخواست با اصول اخلاقی ما سازگار نیست و قابل پردازش نمی‌باشد. اگر فکر می‌کنید این یک خطای اشتباه است، لطفاً به پشتیبانی اطلاع دهید.',
        en: '❌ The requested content violates our ethical guidelines and cannot be processed. If you believe this is a mistake, please contact support.',
        ar: '❌ المحتوى المطلوب ينتهك إرشاداتنا الأخلاقية ولا يمكن معالجته. إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع الدعم.'
      };
      let langKey = (language || 'en').toLowerCase();
      if (langKey.includes('fa')) langKey = 'fa';
      else if (langKey.includes('ar')) langKey = 'ar';
      else langKey = 'en';

      return res.status(400).json({ error: localizedError[langKey] });
    }

    const summary = await summarizeText(text, language, length, style);
    res.json({ summary });
  } catch (err) {
    console.error('❌ [SUMMARIZER] Error:', err);
    res.status(500).json({ 
      error: 'Failed to summarize text.',
      details: err.message
    });
  }
});

// POST /unprotected/translator
router.post('/unprotected/translator', async (req, res) => {
  try {
    const { text, to, tone } = req.body;
    
    if (!text || !to) {
      return res.status(400).json({ error: 'Text and target language are required.' });
    }

    const translation = await translateText(text, to, tone);
    res.json({ translation });
  } catch (err) {
    console.error('❌ [TRANSLATOR] Error:', err);
    res.status(500).json({ 
      error: 'Failed to translate text.',
      details: err.message
    });
  }
});

// POST /unprotected/grammar
router.post('/unprotected/grammar', async (req, res) => {
  try {
    const { text, language, formalityLevel } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required.' });
    }

    const corrected = await fixGrammar(text, language, formalityLevel);
    res.json({ corrected });
  } catch (err) {
    console.error('❌ [GRAMMAR] Error:', err);
    res.status(500).json({ 
      error: 'Failed to correct grammar.',
      details: err.message
    });
  }
});

// POST /unprotected/textGenerator
router.post('/unprotected/textGenerator', async (req, res) => {
  try {
    const { prompt, tone, contentType, language, length } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const normalized = prompt.toLowerCase();
    const forbiddenWords = ['سکس', 'سکسی', 'کودک', 'زیر ۱۸', 'زیر18', 'rape', 'child', 'sex', 'underage'];

    if (forbiddenWords.some(word => normalized.includes(word))) {
      const localizedError = {
        fa: '❌ این درخواست با اصول اخلاقی ما سازگار نیست و قابل پردازش نمی‌باشد. اگر فکر می‌کنید این یک خطای اشتباه است، لطفاً به پشتیبانی اطلاع دهید.',
        en: '❌ The requested content violates our ethical guidelines and cannot be processed. If you believe this is a mistake, please contact support.',
        ar: '❌ المحتوى المطلوب ينتهك إرشاداتنا الأخلاقية ولا يمكن معالجته. إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع الدعم.'
      };

      let langKey = (language || 'en').toLowerCase();
      if (langKey.includes('fa')) langKey = 'fa';
      else if (langKey.includes('ar')) langKey = 'ar';
      else langKey = 'en';

      const errorMessage = localizedError[langKey];
      return res.status(400).json({ error: errorMessage });
    }

    const systemPrompt = `
    You are "YAR" — an intelligent, ethical, and multilingual AI writing assistant. Your goal is to generate high-quality, human-like text based on the user's request, tone, content type, and language preferences.

    ⚠️ RULES:
    - Under no circumstances should you generate content that is:
      - sexually explicit
      - discriminatory
      - violent
      - promoting harm, self-harm, or illegal activities
      - hate speech or bullying
      - religiously or politically extreme
      - violating community standards

    - If the user's input is inappropriate or unsafe, DO NOT generate text. Instead, respond politely and say:
      "❌ The requested content violates our ethical guidelines and cannot be processed."

    📌 PARAMETERS:
    📝 Content Type: ${contentType}
    🎭 Tone: ${tone}
    🕒 Length: ${length}
    🌍 Output Language: ${language}

    ✍️ WRITING GUIDELINES:
    - Match the tone and structure of the requested content.
    - Keep the length within range:
      - Very Short: 1–4 lines
      - Short: 1–2 paragraphs
      - Medium: 3–5 paragraphs
      - Long: 5+ detailed paragraphs

    🌐 Language Guidance:
    - Persian (fa): fluent, native, culturally appropriate.
    - English (en): grammatically natural and idiomatic.
    - Arabic (ar): well-formed, formal or contextual.

    💬 User Request:
    "${prompt}"
    `;

    const generated = await generateText(prompt, tone, contentType, language, length, systemPrompt);
    res.json({ generated });
  } catch (err) {
    console.error('❌ [TEXT_GENERATOR] Error:', err);
    res.status(500).json({ 
      error: 'Failed to generate text.',
      details: err.message
    });
  }
});

// -------------------- PROTECTED ROUTES (REQUIRE AUTHENTICATION) --------------------

// POST /summarizer
router.post('/summarizer', verifyToken, async (req, res) => {
  try {
    const { text, language, length } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required.' });
    }

    const summary = await summarizeText(text, language, length);
    res.json({ summary });
  } catch (err) {
    console.error('❌ [SUMMARIZER] Error:', err);
    res.status(500).json({ 
      error: 'Failed to summarize text.',
      details: err.message
    });
  }
});

// POST /translator
router.post('/translator', verifyToken, async (req, res) => {
  try {
    const { text, to, tone } = req.body;
    
    if (!text || !to) {
      return res.status(400).json({ error: 'Text and target language are required.' });
    }

    const translation = await translateText(text, to, tone);
    res.json({ translation });
  } catch (err) {
    console.error('❌ [TRANSLATOR] Error:', err);
    res.status(500).json({ 
      error: 'Failed to translate text.',
      details: err.message
    });
  }
});

// POST /grammar
router.post('/grammar', verifyToken, async (req, res) => {
  try {
    const { text, language, formalityLevel } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required.' });
    }

    const corrected = await fixGrammar(text, language, formalityLevel);
    res.json({ corrected });
  } catch (err) {
    console.error('❌ [GRAMMAR] Error:', err);
    res.status(500).json({ 
      error: 'Failed to correct grammar.',
      details: err.message
    });
  }
});

// POST /textGenerator
router.post('/textGenerator', verifyToken, async (req, res) => {
  try {
    const { prompt, tone, contentType, language, length } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const generated = await generateText(prompt, tone, contentType, language, length);
    res.json({ generated });
  } catch (err) {
    console.error('❌ [TEXT_GENERATOR] Error:', err);
    res.status(500).json({ 
      error: 'Failed to generate text.',
      details: err.message
    });
  }
});

export default router;