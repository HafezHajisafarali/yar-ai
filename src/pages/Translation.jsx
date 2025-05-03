import { useState, useRef, useEffect } from 'react';
import './Translation.css';

function SendIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

function SwapIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 16L3 12M3 12L7 8M3 12H21M17 8L21 12M21 12L17 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const languages = [
  { id: 'fa', name: 'فارسی' },
  { id: 'en', name: 'انگلیسی' },
  { id: 'ar', name: 'عربی' },
  { id: 'fr', name: 'فرانسوی' },
  { id: 'de', name: 'آلمانی' },
  { id: 'es', name: 'اسپانیایی' },
  { id: 'ru', name: 'روسی' },
  { id: 'tr', name: 'ترکی' },
];

export default function Translation() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('fa');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setIsTranslating(true);
    try {
      const response = await fetch('/api/tools/unprotected/translator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: sourceText,
          to: targetLanguage,
          tone: 'neutral' // می‌تونی dynamicش هم بکنی اگه خواستی
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to translate');
      }
  
      setTranslatedText(data.translation);
    } catch (error) {
      console.error('❌ Error translating:', error);
      setTranslatedText(`❌ خطا در ترجمه: ${error.message}`);
    }
    setIsTranslating(false);
  };
  
  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleSwapLanguages = () => {
    const tempLang = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(tempLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleTranslate();
    }
  };

  return (
    <div className="translation-container">
      <div className="translation-header">
        <h1 className="page-title">ترجمه متن</h1>
      </div>
      
      <div className="translation-content">
        <div className="language-controls">
          <div className="language-selector">
            <select 
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              className="language-select"
            >
              {languages.map(lang => (
                <option key={lang.id} value={lang.id}>{lang.name}</option>
              ))}
            </select>
          </div>
          
          <button 
            className="swap-button" 
            onClick={handleSwapLanguages}
            title="جابجا کردن زبان‌ها"
          >
            <SwapIcon />
          </button>
          
          <div className="language-selector">
            <select 
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="language-select"
            >
              {languages.map(lang => (
                <option key={lang.id} value={lang.id}>{lang.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="translation-boxes">
          <div className="translation-box source">
            <textarea
              className="translation-textarea"
              placeholder="متن مورد نظر برای ترجمه را وارد کنید..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="textarea-actions">
              <button 
                className="action-button copy" 
                onClick={() => handleCopy(sourceText)}
                disabled={!sourceText}
                title="کپی متن"
              >
                <CopyIcon />
              </button>
            </div>
          </div>
          
          <div className="translation-box result">
            <textarea
              className="translation-textarea"
              placeholder="ترجمه اینجا نمایش داده می‌شود..."
              value={translatedText}
              readOnly
            />
            <div className="textarea-actions">
              <button 
                className="action-button copy" 
                onClick={() => handleCopy(translatedText)}
                disabled={!translatedText}
                title="کپی ترجمه"
              >
                <CopyIcon />
              </button>
            </div>
          </div>
        </div>
        
        <div className="translation-actions">
          <button 
            className="translate-button" 
            onClick={handleTranslate}
            disabled={!sourceText.trim() || isTranslating}
          >
            {isTranslating ? 'در حال ترجمه...' : 'ترجمه کن'}
            {!isTranslating && <SendIcon />}
          </button>
          <div className="translation-tips">
            فشردن <kbd>Ctrl</kbd> + <kbd>Enter</kbd> برای ترجمه سریع
          </div>
        </div>
      </div>
    </div>
  );
} 