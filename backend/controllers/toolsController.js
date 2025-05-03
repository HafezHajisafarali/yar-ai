import Tool from '../models/Tool.js';
import openai from '../utils/openai.js';

export const getAllTools = async (req, res) => {
  try {
    const tools = await Tool.find();
    res.status(200).json(tools);
  } catch (err) {
    console.error('❌ Error in getAllTools:', err);
    res.status(500).json({ message: 'خطا در دریافت لیست ابزارها.' });
  }
};

export const seedTools = async (req, res) => {
  try {
    const sampleTools = [
      {
        name: 'Text Generator',
        slug: 'text-generator',
        description: 'Generate blog posts, emails, and more',
        category: 'content',
        isPremium: false,
        icon: '✍️',
      },
      {
        name: 'Image Editor',
        slug: 'image-editor',
        description: 'Enhance and edit images using AI',
        category: 'design',
        isPremium: true,
        icon: '🖼️',
      },
      {
        name: 'Summarizer',
        slug: 'summarizer',
        description: 'Summarize long texts into key points',
        category: 'education',
        isPremium: false,
        icon: '🧠',
      },
    ];

    await Tool.deleteMany();
    await Tool.insertMany(sampleTools);

    res.status(201).json({ message: 'ابزارهای تستی با موفقیت وارد شدند.' });
  } catch (err) {
    console.error('❌ Error in seedTools:', err);
    res.status(500).json({ message: 'خطا در بارگذاری ابزارهای تستی.' });
  }
};

export const textGenerator = async (req, res) => {
  try {
    const { 
      prompt,
      tone = 'professional',
      contentType = 'blog',
      language = 'fa',
      length = 'medium'
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'متن ورودی الزامی است.' });
    }

    // Validate content type
    const validContentTypes = ['blog', 'ad', 'product', 'social', 'email'];
    if (!validContentTypes.includes(contentType)) {
      return res.status(400).json({ message: 'نوع محتوا معتبر نیست.' });
    }

    // Validate length
    const validLengths = ['very-short', 'short', 'medium', 'long'];
    if (!validLengths.includes(length)) {
      return res.status(400).json({ message: 'طول متن معتبر نیست.' });
    }

    const result = await openai.generateText(prompt, tone, contentType, language, length);
    res.status(200).json({ result });
  } catch (err) {
    console.error('❌ Error in textGenerator:', err.message || err);
    res.status(500).json({ message: err.message || 'خطا در تولید متن.' });
  }
};

export const summarizer = async (req, res) => {
  try {
    const { 
      text,
      language = 'fa',
      length = 'medium',
      style = 'narrative'
    } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'متنی برای خلاصه‌سازی ارسال نشده است.' });
    }

    // Validate style
    const validStyles = ['narrative', 'bullet', 'academic'];
    if (!validStyles.includes(style)) {
      return res.status(400).json({ message: 'سبک خلاصه‌سازی معتبر نیست.' });
    }

    const summary = await openai.summarizeText(text, language, length, style);
    res.status(200).json({ summary });
  } catch (err) {
    console.error('❌ Error in summarizer:', err.message || err);
    res.status(500).json({ message: err.message || 'خطا در خلاصه‌سازی.' });
  }
};

export const translator = async (req, res) => {
  try {
    const { 
      text,
      to,
      tone = 'neutral',
      preserveStructure = true
    } = req.body;

    if (!text || !to) {
      return res.status(400).json({ message: 'متن و زبان مقصد الزامی هستند.' });
    }

    // Validate target language
    const validLanguages = ['fa', 'en', 'ar'];
    if (!validLanguages.includes(to)) {
      return res.status(400).json({ message: 'زبان مقصد پشتیبانی نمی‌شود.' });
    }

    const translated = await openai.translateText(text, to, tone, preserveStructure);
    res.status(200).json({ translated });
  } catch (err) {
    console.error('❌ Error in translator:', err.message || err);
    res.status(500).json({ message: err.message || 'خطا در ترجمه.' });
  }
};

export const grammarFixer = async (req, res) => {
  try {
    const { 
      text,
      language = 'fa',
      formalityLevel = 'neutral',
      preservePhrasing = true
    } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'متنی برای اصلاح گرامر ارسال نشده است.' });
    }

    // Validate formality level
    const validFormalityLevels = ['informal', 'neutral', 'formal'];
    if (!validFormalityLevels.includes(formalityLevel)) {
      return res.status(400).json({ message: 'سطح رسمیت معتبر نیست.' });
    }

    const improved = await openai.fixGrammar(text, language, formalityLevel, preservePhrasing);
    res.status(200).json({ improved });
  } catch (err) {
    console.error('❌ Error in grammarFixer:', err.message || err);
    res.status(500).json({ message: err.message || 'خطا در بهبود متن.' });
  }
};