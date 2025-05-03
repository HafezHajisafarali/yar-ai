import React, { useState, useRef, useEffect } from 'react';
import './Mainchat.css';

function SendIcon() {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  );
}

function ThumbsUpIcon() {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em">
      <path d="M7 10v12m8.336-15.66A2.995 2.995 0 0017 8.198l-5 7.875-5-7.875a3 3 0 114.336-4.062z" />
    </svg>
  );
}

function ThumbsDownIcon() {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em">
      <path d="M17 14V2m-8.336 3.66A2.995 2.995 0 007 3.802l5-7.875 5 7.875a3 3 0 11-4.336 4.062z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em">
      <path d="M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.912 4.895 3 6 3h8c1.105 0 2 .912 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.088 19.105 22 18 22h-8c-1.105 0-2-.912-2-2.036V9.107c0-1.124.895-2.036 2-2.036z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
      <path d="M2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em">
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}

const Mainchat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const messageContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const messageContainer = messageContainerRef.current;
    if (messageContainer) {
      const observer = new ResizeObserver(() => {
        scrollToBottom();
      });
      observer.observe(messageContainer);
      return () => observer.disconnect();
    }
  }, []);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto first to get the correct scrollHeight
      textarea.style.height = 'auto';
      
      // Get line height in pixels
      const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);
      
      // Calculate max height (10 lines)
      const maxHeight = lineHeight * 10;
      
      // Calculate new height based on content
      const newHeight = Math.min(Math.max(textarea.scrollHeight, lineHeight), maxHeight);
      textarea.style.height = `${newHeight}px`;
      
      // Update container padding to maintain visual balance
      const messageContainer = document.querySelector('.message-input-container');
      if (messageContainer) {
        const paddingBottom = Math.max(24, (newHeight - lineHeight) / 2);
        messageContainer.style.paddingBottom = `${paddingBottom}px`;
      }
    }
  };

  // Add resize observer to handle window resizing
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      const resizeObserver = new ResizeObserver(() => {
        adjustTextareaHeight();
      });
      resizeObserver.observe(textarea);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    adjustTextareaHeight();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const handleCopyMessage = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a notification here
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '' || isTyping) return;

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setHasStartedChat(true);
    if (textareaRef.current) {
      textareaRef.current.style.height = '24px';
    }
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: 'سلام! من دستیار هوشمند یار هستم. چطور می‌تونم کمکتون کنم؟',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  if (!hasStartedChat) {
    return (
      <div className="landing-container">
        <h1 className="landing-title">چطور می‌تونم کمکتون کنم؟</h1>
        <form onSubmit={handleSendMessage} className="landing-input-form">
          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder="پیام خود را اینجا بنویسید..."
            className="landing-input"
            rows="1"
          />
          <div className="message-input-buttons">
            <button 
              type="submit" 
              className="input-action-button send-button"
              disabled={!inputMessage.trim() || isTyping}
            >
              <SendIcon />
            </button>
          </div>
        </form>
        <div className="warning-text">
          پاسخ‌های یار همیشه دقیق نیست؛ حتماً دوباره بررسی کنید!
        </div>
      </div>
    );
  }

  return (
    <div className="mainchat-container">
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-header-text">
            <h1>دستیار هوشمند یار</h1>
          </div>
        </div>
      </div>
      
      <div className="messages-container" ref={messageContainerRef}>
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-content">
              <p className="message-text">{message.text}</p>
              <span className="message-timestamp">{message.timestamp}</span>
              {message.sender === 'ai' && (
                <div className="message-actions">
                  <button 
                    className="message-action-button"
                    onClick={() => handleCopyMessage(message.text)}
                    title="کپی متن"
                  >
                    <CopyIcon />
                  </button>
                  <button className="message-action-button" title="بازخورد مثبت">
                    <ThumbsUpIcon />
                  </button>
                  <button className="message-action-button" title="بازخورد منفی">
                    <ThumbsDownIcon />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message ai-message">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bottom-container">
        <div className="message-input-container">
          <form onSubmit={handleSendMessage} className="message-input-form">
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              placeholder="پیام خود را اینجا بنویسید..."
              className="message-input"
              rows="1"
            />
            <div className="message-input-buttons">
              <button 
                type="submit" 
                className="input-action-button send-button"
                disabled={!inputMessage.trim() || isTyping}
              >
                <SendIcon />
              </button>
            </div>
          </form>
        </div>
        
        <div className="warning-text">
          پاسخ‌های یار همیشه دقیق نیست؛ حتماً دوباره بررسی کنید!
        </div>
      </div>
    </div>
  );
};

export default Mainchat; 