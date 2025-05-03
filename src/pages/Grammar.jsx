import { useState } from 'react';
import './Grammar.css';

function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

const languageOptions = [
  { id: 'fa', name: 'فارسی' },
  { id: 'en', name: 'انگلیسی' }
];

export default function Grammar() {
  const [text, setText] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [corrections, setCorrections] = useState([]);
  const [language, setLanguage] = useState('fa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formalityLevel, setFormalityLevel] = useState('medium');

  const handleTextChange = (e) => {
    setText(e.target.value);
    // Clear previous corrections when text changes
    if (correctedText) {
      setCorrectedText('');
      setCorrections([]);
    }
  };

  const handleCorrectGrammar = async () => {
    if (!text.trim()) return;
  
    setIsProcessing(true);
  
    try {
      const response = await fetch('/api/tools/unprotected/grammar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          language,
          formalityLevel
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to correct grammar');
      }
  
      setCorrectedText(data.corrected || '');
      setCorrections([]); // فعلاً لیست اصلاحات رو خالی می‌ذاریم
    } catch (err) {
      console.error('Grammar correction error:', err);
      setCorrectedText('❌ خطا در تصحیح متن: ' + err.message);
    }
  
    setIsProcessing(false);
  };

  const handleCopy = async (textToCopy) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      // You could add a notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleCorrectGrammar();
    }
  };

  return (
    <div className="grammar-container">
      <div className="grammar-header">
        <h1 className="page-title">تصحیح گرامر</h1>
      </div>
      
      <div className="grammar-content">
        <div className="grammar-controls">
          <div className="control-group">
            <label htmlFor="language-select">زبان:</label>
            <select 
              id="language-select"
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
            <label htmlFor="formality-select">سطح رسمی بودن:</label>
            <select 
              id="formality-select"
              value={formalityLevel}
              onChange={(e) => setFormalityLevel(e.target.value)}
              className="control-select"
            >
              <option value="casual">غیر رسمی</option>
              <option value="medium">متوسط</option>
              <option value="formal">رسمی</option>
            </select>
          </div>
        </div>
        
        <div className="input-section">
          <label htmlFor="text-input">متن خود را وارد کنید:</label>
          <div className="textarea-wrapper">
            <textarea
              id="text-input"
              className="grammar-textarea"
              placeholder="متن خود را اینجا وارد کنید..."
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
            />
            <div className="textarea-actions">
              <button 
                className="action-button"
                onClick={() => handleCopy(text)}
                disabled={!text}
                title="کپی متن"
              >
                <CopyIcon />
              </button>
            </div>
          </div>
        </div>
        
        <div className="grammar-action">
          <button 
            className="correct-button" 
            onClick={handleCorrectGrammar}
            disabled={!text.trim() || isProcessing}
          >
            {isProcessing ? 'در حال تصحیح...' : 'تصحیح گرامر'}
            {!isProcessing && <CheckIcon />}
          </button>
          <div className="action-tip">
            فشردن <kbd>Ctrl</kbd> + <kbd>Enter</kbd> برای تصحیح سریع
          </div>
        </div>
        
        {correctedText && (
          <div className="output-section">
            <h2 className="section-title">متن تصحیح شده:</h2>
            <div className="output-content">
              <div className="corrected-text-container">
                <p className="corrected-text">{correctedText}</p>
                <button 
                  className="copy-corrected-button"
                  onClick={() => handleCopy(correctedText)}
                  title="کپی متن تصحیح شده"
                >
                  <CopyIcon /> کپی متن
                </button>
              </div>
              
              {corrections.length > 0 && (
                <div className="corrections-list">
                  <h3 className="list-title">تغییرات انجام شده:</h3>
                  <ul>
                    {corrections.map((correction, index) => (
                      <li key={index} className="correction-item">
                        <div className="correction-original">"{correction.original}"</div>
                        <div className="correction-arrow">→</div>
                        <div className="correction-corrected">"{correction.corrected}"</div>
                        <div className="correction-explanation">{correction.explanation}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 