import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Content moderation function
const moderateContent = async (text) => {
  try {
    const response = await openai.moderations.create({ input: text });
    return {
      flagged: response.results[0].flagged,
      categories: response.results[0].categories
    };
  } catch (error) {
    console.error('Moderation API Error:', error);
    return { flagged: false, categories: {} };
  }
};

// Text Generator
export const generateText = async (
  prompt,
  tone = 'professional',
  contentType = 'blog',
  language = 'fa',
  length = 'medium'
) => {
  // Content moderation
  const moderation = await moderateContent(prompt);
  if (moderation.flagged) {
    throw new Error('متن شما شامل محتوای نامناسب است. لطفاً دوباره تلاش کنید.');
  }

  // Define token limits based on length
  const tokenLimits = {
    'very-short': 150,  // 1-4 lines
    'short': 300,      // 1-2 paragraphs
    'medium': 700,     // 3-5 paragraphs
    'long': 1000,      // 5+ paragraphs
  };

  const maxTokens = tokenLimits[length] || tokenLimits.medium;

  // Enhanced system prompt
  const systemPrompt = `You are YAR's advanced text generation AI, specialized in creating natural, engaging content.

CONTENT TYPE: ${contentType}
LANGUAGE: ${language === 'fa' ? 'Persian' : language === 'ar' ? 'Arabic' : 'English'}
LENGTH: ${length}
TONE: ${tone}

Key Instructions:
1. For Persian/Arabic content:
   - Use culturally appropriate idioms and expressions
   - Maintain proper formal/informal tone distinctions
   - Consider regional language variations

2. Style Guidelines:
   - Avoid generic AI-like phrasing
   - Use natural language patterns
   - No unnecessary introductions or conclusions
   - Create engaging, human-like content

3. Length-Specific Rules:
   - Very Short: Direct and impactful, no fluff
   - Short: Focused message, minimal context
   - Medium: Balanced detail and brevity
   - Long: Comprehensive but engaging

4. Content Type Specifics:
   - Blog: Conversational yet informative
   - Ad Copy: Persuasive and concise
   - Product Description: Clear and compelling
   - Social Media: Engaging and shareable
   - Email: Professional and purposeful

Remember: Quality over quantity. Avoid repetition and generic phrases.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: maxTokens
  });

  return response.choices[0].message.content;
};

// Summarizer
export const summarizeText = async (text, language = 'fa', length = 'medium', style = 'narrative') => {
  // Content moderation
  const moderation = await moderateContent(text);
  if (moderation.flagged) {
    throw new Error('متن شما شامل محتوای نامناسب است. لطفاً دوباره تلاش کنید.');
  }

  // Validate input length
  if (text.split(' ').length < 30) {
    throw new Error('متن برای خلاصه‌سازی بسیار کوتاه است. حداقل ۳۰ کلمه نیاز است.');
  }

  const maxTokens = length === 'short' ? 150 : length === 'long' ? 500 : 300;

  const systemPrompt = `You are YAR's expert summarization AI, trained to create concise, accurate, and contextually aware summaries.

LANGUAGE: ${language === 'fa' ? 'Persian' : language === 'ar' ? 'Arabic' : 'English'}
STYLE: ${style}
LENGTH: ${length}

Key Instructions:
1. Summary Style Rules:
   ${style === 'bullet' ? `
   - MUST return 3-5 key points
   - Each point MUST start with a bullet point (•)
   - Each point should be a complete, concise thought
   - Points should be ordered by importance
   - No introductory or concluding text` 
   : style === 'narrative' ? `
   - Create a flowing, coherent paragraph
   - Use natural transitions
   - Maintain narrative flow
   - Include a brief conclusion`
   : `
   - Use formal academic tone
   - Focus on methodology and findings
   - Include citations if present
   - Maintain scholarly structure`}

2. Language-Specific Guidelines:
   - Persian: Maintain cultural context and nuance
   - Arabic: Consider dialectical variations
   - English: Focus on clarity and conciseness

3. Content Guidelines:
   - Maintain political neutrality
   - Preserve essential context
   - Remove redundancy
   - Focus on key messages
   - Ensure factual accuracy

Remember: Quality and accuracy over brevity.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `${style === 'bullet' ? 'Create 3-5 bullet points summarizing the key points from this text. Each point MUST start with • and represent a complete idea:' : 'Summarize the following text:'}\n\n${text}` }
    ],
    temperature: 0.5,
    max_tokens: maxTokens
  });

  return response.choices[0].message.content;
};

// Translator
export const translateText = async (text, targetLang, tone = 'neutral', preserveStructure = true) => {
  // Content moderation
  const moderation = await moderateContent(text);
  if (moderation.flagged) {
    throw new Error('متن شما شامل محتوای نامناسب است. لطفاً دوباره تلاش کنید.');
  }

  const systemPrompt = `You are YAR's professional translation AI, specialized in maintaining meaning, tone, and cultural context.

TARGET LANGUAGE: ${targetLang}
TONE: ${tone}
PRESERVE STRUCTURE: ${preserveStructure ? 'Yes' : 'No'}

Key Instructions:
1. Translation Guidelines:
   - Maintain original meaning and context
   - Preserve emotional resonance and tone
   - Handle idioms appropriately
   - Keep marketing/emotional content intact

2. Language Pair Specifics:
   Persian ⇄ English:
   - Handle تعارف appropriately
   - Maintain formal/informal distinctions
   - Preserve poetic elements when present

   Arabic ⇄ English:
   - Consider dialectical variations
   - Maintain cultural sensitivities
   - Preserve religious/cultural references

3. Structure Rules:
   - Maintain original formatting
   - Preserve paragraph breaks
   - Keep sentence structure when possible
   - Adapt only when clarity requires

4. Quality Checks:
   - Ensure natural flow
   - Verify cultural appropriateness
   - Check for mistranslated idioms
   - Maintain professional tone

Remember: Accuracy and cultural sensitivity are paramount.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Translate the following text to ${targetLang}:\n\n${text}` }
    ],
    temperature: 0.3,
    max_tokens: 800
  });

  return response.choices[0].message.content;
};

// Grammar Fixer
export const fixGrammar = async (text, language = 'fa', formalityLevel = 'neutral', preservePhrasing = true) => {
  // Content moderation
  const moderation = await moderateContent(text);
  if (moderation.flagged) {
    throw new Error('متن شما شامل محتوای نامناسب است. لطفاً دوباره تلاش کنید.');
  }

  const systemPrompt = `You are YAR's expert Persian language editor, with deep understanding of both formal and colloquial Persian.

LANGUAGE: Persian (Farsi)
FORMALITY: ${formalityLevel}
PRESERVE PHRASING: ${preservePhrasing ? 'Yes' : 'No'}

Key Instructions:
1. Persian Name Analysis:
   - First identify traditional Persian names in the text
   - Check if name is traditionally male or female:
     * Male names: مهدی، علی، محمد، حسین، رضا، امیر، احمد، etc.
     * Female names: زهرا، فاطمه، مریم، نرگس، لیلا، etc.
   - NEVER change the name itself
   - Instead, adjust gender references to match the name's gender

2. Gender Reference Correction:
   - If name is male (like مهدی):
     * Change دختر to پسر
     * Adjust related pronouns and adjectives
   - If name is female (like زهرا):
     * Change پسر to دختر
     * Adjust related pronouns and adjectives
   - Keep all other grammar and structure intact

3. Grammar Structure Rules:
   - Fix verb conjugations
   - Correct را placement
   - Fix pronoun references
   - Keep proper word order
   - Maintain natural flow

4. Dialogue and Punctuation:
   - Use proper quotation marks
   - Add appropriate punctuation
   - Keep sentence structure natural
   - Preserve conversational tone

Remember: First check the name's traditional gender, then adjust references to match - never change the name itself.

Example corrections:
Incorrect: "من یک دختر دارم اسم او مهدی است"
Correct: "من یک پسر دارم، اسم او مهدی است."

Incorrect: "من یک پسر دارم اسم او زهرا است"
Correct: "من یک دختر دارم، اسم او زهرا است."`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { 
        role: 'user', 
        content: `Please correct this Persian text by first checking the name's traditional gender and then adjusting gender references accordingly:\n\n${text}`
      }
    ],
    temperature: 0.3,
    max_tokens: 800
  });

  return response.choices[0].message.content;
};