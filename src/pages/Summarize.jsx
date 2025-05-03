import { useState } from 'react';
import './Summarize.css';

function MagicWandIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14.5 9H22L16 14L18 22L12 18L6 22L8 14L2 9H9.5L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

function PasteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function Summarize() {
  const [originalText, setOriginalText] = useState('');
  const [summarizedText, setSummarizedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [summaryLength, setSummaryLength] = useState('medium');
  const [summaryStyle, setSummaryStyle] = useState('concise');
  const [language, setLanguage] = useState('fa');
  
  const handleSummarize = async () => {
    if (!originalText.trim()) return;
    setIsProcessing(true);
    try {
      const response = await fetch('/api/tools/unprotected/summarizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: originalText, 
          language, 
          length: summaryLength,
          style: summaryStyle === 'bullet' ? 'bullet' : summaryStyle === 'academic' ? 'academic' : 'narrative'
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.details || 'Failed to summarize');
      setSummarizedText(data.summary);
    } catch (error) {
      console.error(error);
      setSummarizedText(`❌ خطا در خلاصه‌سازی: ${error.message}`);
    }
    setIsProcessing(false);
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setOriginalText(text);
    } catch (err) {
      console.error('Failed to paste text: ', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSummarize();
    }
  };
  
  // Calculate characters and estimated reading time
  const characterCount = originalText.length;
  const wordCount = originalText.trim() ? originalText.trim().split(/\s+/).length : 0;
  // Assuming average reading speed of 200 words per minute
  const readingTimeMinutes = Math.ceil(wordCount / 200);

  return (
    <div className="summarize-container">
      <div className="summarize-header">
        <h1 className="page-title">خلاصه‌سازی متن</h1>
      </div>
      
      <div className="summarize-content">
        <div className="summarize-controls">
          <div className="control-group">
            <label htmlFor="language-select">زبان متن:</label>
            <select 
              id="language-select" 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="control-select"
            >
              <option value="fa">فارسی</option>
              <option value="en">انگلیسی</option>
            </select>
          </div>
          
          <div className="control-group">
            <label htmlFor="length-select">طول خلاصه:</label>
            <select 
              id="length-select" 
              value={summaryLength}
              onChange={(e) => setSummaryLength(e.target.value)}
              className="control-select"
            >
              <option value="very-short">خیلی کوتاه</option>
              <option value="short">کوتاه</option>
              <option value="medium">متوسط</option>
              <option value="long">بلند</option>
            </select>
          </div>
          
          <div className="control-group">
            <label htmlFor="style-select">سبک خلاصه:</label>
            <select 
              id="style-select" 
              value={summaryStyle}
              onChange={(e) => setSummaryStyle(e.target.value)}
              className="control-select"
            >
              <option value="concise">مختصر</option>
              <option value="bullet">بولت‌پوینت</option>
              <option value="academic">آکادمیک</option>
              <option value="simple">ساده</option>
            </select>
          </div>
        </div>
        
        <div className="input-section">
          <div className="input-header">
            <label htmlFor="original-text">متن اصلی:</label>
            <div className="text-stats">
              <span>{characterCount} کاراکتر</span>
              <span>•</span>
              <span>{wordCount} کلمه</span>
              <span>•</span>
              <span>~{readingTimeMinutes} دقیقه مطالعه</span>
            </div>
          </div>
          
          <div className="textarea-wrapper">
            <textarea
              id="original-text"
              className="summarize-textarea"
              placeholder="متن خود را اینجا وارد کنید یا از دکمه چسباندن استفاده کنید..."
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="textarea-actions">
              <button 
                className="action-button"
                onClick={handlePaste}
                title="چسباندن از کلیپ‌بورد"
              >
                <PasteIcon />
              </button>
              <button 
                className="action-button"
                onClick={() => handleCopy(originalText)}
                disabled={!originalText}
                title="کپی متن"
              >
                <CopyIcon />
              </button>
            </div>
          </div>
        </div>
        
        <div className="summarize-action">
          <button 
            className="summarize-button" 
            onClick={handleSummarize}
            disabled={!originalText.trim() || isProcessing}
          >
            {isProcessing ? 'در حال خلاصه‌سازی...' : 'خلاصه کن'}
            {!isProcessing && <MagicWandIcon />}
          </button>
          <div className="action-tip">
            فشردن <kbd>Ctrl</kbd> + <kbd>Enter</kbd> برای خلاصه‌سازی سریع
          </div>
        </div>
        
        {summarizedText && (
          <div className="output-section">
            <h2 className="section-title">متن خلاصه شده:</h2>
            <div className="summary-container">
              <p className="summary-text">{summarizedText}</p>
              <button 
                className="copy-summary-button"
                onClick={() => handleCopy(summarizedText)}
                title="کپی خلاصه"
              >
                <CopyIcon /> کپی خلاصه
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 