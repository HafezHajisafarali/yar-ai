import { useState } from 'react';
import './TextGenerator.css';

function LightningIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 9H11C9.89543 9 9 9.89543 9 11V20C9 21.1046 9.89543 22 11 22H20C21.1046 22 22 21.1046 22 20V11C22 9.89543 21.1046 9 20 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ReloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 4V10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M23 20V14H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20.49 9C19.9828 7.56678 19.1209 6.2854 17.9845 5.27542C16.8482 4.26543 15.4745 3.55976 13.9917 3.22426C12.5089 2.88875 10.9652 2.93434 9.50481 3.35677C8.04437 3.77921 6.71475 4.56471 5.64 5.64L1 10M23 14L18.36 18.36C17.2853 19.4353 15.9556 20.2208 14.4952 20.6432C13.0348 21.0657 11.4911 21.1112 10.0083 20.7757C8.52547 20.4402 7.1518 19.7346 6.01547 18.7246C4.87913 17.7146 4.01717 16.4332 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const topicPlaceholders = [
  "داستان کوتاه در مورد یک سفر جادویی",
  "ایمیل رسمی به یک مدیر شرکت درباره درخواست همکاری",
  "پست بلاگ درباره فواید یوگا و مدیتیشن",
  "متن تبریک تولد خلاقانه برای یک دوست قدیمی",
  "پیام تسلیت رسمی برای همکار"
];

const contentTypes = [
  { id: 'blog', name: 'مقاله' },
  { id: 'email', name: 'ایمیل' },
  { id: 'caption', name: 'کپشن شبکه اجتماعی' },
  { id: 'script', name: 'سناریو ویدیو' },
  { id: 'letter', name: 'نامه' },
  { id: 'poem', name: 'شعر' },
  { id: 'story', name: 'داستان' },
  { id: 'analysis', name: 'تحلیلی / تخصصی' },
  { id: 'other', name: 'سایر موارد' }
];

const toneOptions = [
  { id: 'formal', name: 'رسمی' },
  { id: 'casual', name: 'محاوره‌ای' },
  { id: 'professional', name: 'حرفه‌ای' },
  { id: 'humorous', name: 'طنز' },
  { id: 'analytical', name: 'تحلیلی' },
  { id: 'motivational', name: 'انگیزشی' }
];

const languageOptions = [
  { id: 'fa', name: 'فارسی' },
  { id: 'en', name: 'انگلیسی' },
  { id: 'ar', name: 'عربی' }
];

const lengthOptions = [
  { id: 'very-short', name: 'خیلی کوتاه (۱–۴ خط)' },
  { id: 'short', name: 'کوتاه (۱–۲ پاراگراف)' },
  { id: 'medium', name: 'متوسط (۳–۵ پاراگراف)' },
  { id: 'long', name: 'بلند (بیش از ۵ پاراگراف)' }
];

export default function TextGenerator() {
  const [prompt, setPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentType, setContentType] = useState('blog');
  const [tone, setTone] = useState('professional');
  const [language, setLanguage] = useState('fa');
  const [length, setLength] = useState('medium');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 500;

  const getRandomPlaceholder = () => {
    const newIndex = Math.floor(Math.random() * topicPlaceholders.length);
    setPlaceholderIndex(newIndex);
    return topicPlaceholders[newIndex];
  };

  const handlePromptChange = (e) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setPrompt(text);
      setCharCount(text.length);
    }
  };

  
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      console.log('Sending request with:', { prompt, tone, contentType, language, length });
      
      const response = await fetch('https://www.y4r.net/api/tools/unprotected/textGenerator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          tone,
          contentType,
          language,
          length,
        }),
      });

      const data = await response.json();
      console.log('Response received:', data);

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to generate text');
      }

      if (data.generated) {
        setGeneratedText(data.generated);
      } else {
        setGeneratedText('❌ خطا در تولید متن.');
        console.error('No generated text in response:', data);
      }
    } catch (error) {
      console.error('Error generating text:', error);
      setGeneratedText(`❌ خطا در تولید متن: ${error.message}`);
    }
    setIsGenerating(false);
  };

  const handleRegenerateContent = () => {
    if (prompt.trim()) {
      handleGenerate();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleGenerate();
    }
  };

  return (
    <div className="text-generator-container">
      <div className="text-generator-header">
        <h1 className="page-title">تولید متن</h1>
      </div>
      
      <div className="text-generator-content">
        <div className="input-section">
          <div className="input-header">
            <label htmlFor="prompt-input">ورودی متن (موضوع یا درخواست شما):</label>
            <span className="char-counter">
              {charCount}/{MAX_CHARS}
            </span>
          </div>
          <div className="textarea-wrapper">
            <textarea
              id="prompt-input"
              className="prompt-textarea"
              placeholder={topicPlaceholders[placeholderIndex]}
              value={prompt}
              onChange={handlePromptChange}
              onKeyDown={handleKeyDown}
            />
            <div className="textarea-actions">
              <button 
                className="refresh-placeholder" 
                onClick={getRandomPlaceholder}
                title="مثال دیگر"
              >
                <ReloadIcon />
              </button>
              <button 
                className="clear-text" 
                onClick={() => {
                  setPrompt('');
                  setCharCount(0);
                }}
                title="پاک کردن متن"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div className="generator-controls">
          <div className="control-row">
            <div className="control-group">
              <label htmlFor="content-type">نوع محتوا:</label>
              <select 
                id="content-type" 
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="control-select"
              >
                {contentTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            
            <div className="control-group">
              <label htmlFor="tone">لحن:</label>
              <select 
                id="tone" 
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="control-select"
              >
                {toneOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="control-row">
            <div className="control-group">
              <label htmlFor="language">زبان:</label>
              <select 
                id="language" 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="control-select"
              >
                {languageOptions.map(lang => (
                  <option key={lang.id} value={lang.id}>{lang.name}</option>
                ))}
              </select>
            </div>
            
            <div className="control-group">
              <label htmlFor="length">طول متن:</label>
              <select 
                id="length" 
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="control-select"
              >
                {lengthOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="generate-action">
          <button 
            className="generate-button" 
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
          >
            {isGenerating ? 'در حال تولید متن...' : 'تولید متن'}
            {!isGenerating && <LightningIcon />}
          </button>
          <div className="generate-tip">
            فشردن <kbd>Ctrl</kbd> + <kbd>Enter</kbd> برای تولید سریع
          </div>
        </div>
        
        {generatedText && (
          <div className="output-section">
            <div className="output-header">
              <h2 className="section-title">متن تولید شده:</h2>
              <div className="output-actions">
                <button 
                  className="action-button regenerate"
                  onClick={handleRegenerateContent}
                  title="تولید مجدد"
                >
                  <ReloadIcon />
                </button>
                <button 
                  className="action-button copy"
                  onClick={() => handleCopy(generatedText)}
                  title="کپی متن"
                >
                  <CopyIcon />
                </button>
              </div>
            </div>
            <div className="generated-content">
              {generatedText.split('\n').map((line, index) => {
                if (line.startsWith('# ')) {
                  return <h1 key={index} className="content-h1">{line.substring(2)}</h1>;
                } else if (line.startsWith('## ')) {
                  return <h2 key={index} className="content-h2">{line.substring(3)}</h2>;
                } else if (line.startsWith('### ')) {
                  return <h3 key={index} className="content-h3">{line.substring(4)}</h3>;
                } else if (line.trim().startsWith('1.') || line.trim().startsWith('2.') || line.trim().startsWith('3.')) {
                  return <div key={index} className="content-list-item">{line}</div>;
                } else if (line.trim() === '') {
                  return <div key={index} className="content-space"></div>;
                } else {
                  return <p key={index} className="content-paragraph">{line}</p>;
                }
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 