import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Chat.css';
import HistorySidebar from '../components/HistorySidebar';
import { v4 as uuidv4 } from 'uuid';

// Icons
function SendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.05 11.5C3.2 9.83 3.76 8.25 4.66 6.91C5.56 5.58 6.77 4.54 8.17 3.92C9.57 3.29 11.12 3.11 12.63 3.39C14.14 3.67 15.53 4.4 16.64 5.5L19.5 8.5M20.95 12.5C20.8 14.17 20.24 15.75 19.34 17.09C18.44 18.42 17.23 19.46 15.83 20.08C14.43 20.71 12.88 20.89 11.37 20.61C9.86 20.33 8.47 19.6 7.36 18.5L4.5 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function BotIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 12H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 12H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 16V16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M7 2L10 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M17 2L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(uuidv4());
  const [chatHistory, setChatHistory] = useState({});
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Determine current domain based on URL path
  const currentPath = location.pathname;
  let currentDomainId = '';
  let domainTitle = '';

  if (currentPath.includes('chat-translation')) {
    currentDomainId = 'translation';
    domainTitle = 'ترجمه';
  } else if (currentPath.includes('chat-grammar')) {
    currentDomainId = 'grammar';
    domainTitle = 'تصحیح گرامری';
  } else if (currentPath.includes('chat-summarize')) {
    currentDomainId = 'summarizer';
    domainTitle = 'خلاصه‌سازی';
  } else if (currentPath.includes('chat-text-generator')) {
    currentDomainId = 'textGenerator';
    domainTitle = 'تولید متن';
  }
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input on initial load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }
  }, []);
  
  // Save chat history to localStorage on change
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);
  
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message to conversation
    const userMessage = { id: uuidv4(), role: 'user', content: inputText };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      let endpoint = '';
      let payload = {};

      if (currentDomainId === 'translation') {
        endpoint = '/api/tools/unprotected/translator';
        payload = { text: inputText, to: 'English' }; // You may make 'to' dynamic
      } else if (currentDomainId === 'grammar') {
        endpoint = '/api/tools/unprotected/grammar';
        payload = { text: inputText };
      } else if (currentDomainId === 'summarizer') {
        endpoint = '/api/tools/unprotected/summarizer';
        payload = { text: inputText };
      } else if (currentDomainId === 'textGenerator') {
        endpoint = '/api/tools/unprotected/textGenerator';
        payload = { prompt: inputText };
      } else {
        // fallback
        endpoint = '/api/chat';
        payload = { message: inputText };
      }

      const response = await axios.post(endpoint, payload);
      let botContent = '';
      if (currentDomainId === 'translation') {
        botContent = response.data.translation;
      } else if (currentDomainId === 'grammar') {
        botContent = response.data.corrected;
      } else if (currentDomainId === 'summarizer') {
        botContent = response.data.summary;
      } else if (currentDomainId === 'textGenerator') {
        botContent = response.data.generated;
      } else {
        botContent = response.data.content || 'پاسخ نامشخص از سرور دریافت شد.';
      }

      const botMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: botContent
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setIsTyping(false);

      // Update chat history with title from first message if new chat
      if (messages.length === 0) {
        updateChatHistory(userMessage.content);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      // Add error message to conversation
      const errorMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: 'متأسفانه خطایی رخ داد. لطفاً دوباره تلاش کنید.'
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };
  
  // simulateResponse is no longer needed since real API is used.
  
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const updateChatHistory = (firstMessage) => {
    const truncatedTitle = firstMessage.length > 30 
      ? firstMessage.substring(0, 30) + '...' 
      : firstMessage;
    
    const newChat = {
      id: currentChatId,
      title: truncatedTitle,
      timestamp: new Date().toISOString(),
      lastMessage: new Date().toISOString()
    };
    
    setChatHistory((prevHistory) => {
      // Initialize domain array if it doesn't exist
      const domainChats = prevHistory[currentDomainId] || [];
      
      return {
        ...prevHistory,
        [currentDomainId]: [newChat, ...domainChats]
      };
    });
  };
  
  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(uuidv4());
    setIsSidebarOpen(false);
  };
  
  const handleSelectChat = (chatId) => {
    // In a real implementation, this would load messages for the selected chat
    // from a database or API. For now, we'll just simulate this.
    setCurrentChatId(chatId);
    setMessages([
      { id: uuidv4(), role: 'user', content: 'این یک پیام نمونه از چت قبلی است.' },
      { id: uuidv4(), role: 'assistant', content: 'بله، این یک پاسخ نمونه است. در پیاده‌سازی واقعی، پیام‌های واقعی چت مورد نظر بارگذاری می‌شوند.' }
    ]);
    setIsSidebarOpen(false);
  };
  
  const handleBack = () => {
    navigate('/dashboard');
  };
  
  const handleSupportClick = () => {
    window.open('https://support.yarai.com', '_blank');
  };
  
  return (
    <div className="chat-container">
      <div className="chat-header">
        <button className="header-button" onClick={handleBack} title="بازگشت به داشبورد">
          <BackIcon />
        </button>
        <div className="header-title-container">
          <h1 className="page-title">{domainTitle}</h1>
        </div>
        <button 
          className="header-button history-button" 
          onClick={() => setIsSidebarOpen(true)}
          title="تاریخچه چت"
        >
          <HistoryIcon />
        </button>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="empty-chat">
            <h2>به چت {domainTitle} خوش آمدید</h2>
            <p>برای شروع، پیام خود را در کادر پایین بنویسید.</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-icon">
              {message.role === 'user' ? <UserIcon /> : <BotIcon />}
            </div>
            <div className="message-content">
              {message.content.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i !== message.content.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message bot-message">
            <div className="message-icon">
              <BotIcon />
            </div>
            <div className="message-content typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input-container">
        <textarea
          ref={inputRef}
          className="chat-input"
          placeholder="پیام خود را اینجا بنویسید..."
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button 
          className="send-button"
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isTyping}
        >
          <SendIcon />
        </button>
      </div>
      
      <HistorySidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentDomainId={currentDomainId}
        chatHistory={chatHistory}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onSupportClick={handleSupportClick}
      />
    </div>
  );
} 