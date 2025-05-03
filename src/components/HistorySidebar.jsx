import React from 'react';
import './HistorySidebar.css';

// Icon for the "New Chat" button
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Icon for history items
function MessageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Support Icon (Lifebuoy)
function SupportIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
      <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export default function HistorySidebar({ 
  isOpen, 
  onClose, 
  currentDomainId, 
  chatHistory, 
  onNewChat, 
  onSelectChat,
  onSupportClick
}) {
  const domainHistory = chatHistory[currentDomainId] || [];

  // Prevent closing sidebar when clicking inside it
  const handleSidebarClick = (e) => {
    e.stopPropagation();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="history-sidebar-overlay" onClick={onClose}>
      <div 
        className={`history-sidebar ${isOpen ? 'open' : ''}`}
        onClick={handleSidebarClick} // Prevent overlay click propagation
      >
        <button className="new-chat-button" onClick={onNewChat}>
          <PlusIcon />
          <span>چت جدید</span>
        </button>
        <div className="history-list">
          {domainHistory.length > 0 ? (
            domainHistory.map((chat) => (
              <button 
                key={chat.id}
                className="history-item"
                onClick={() => onSelectChat(chat.id)}
              >
                <MessageIcon />
                <span className="history-item-title">{chat.title || 'چت بدون عنوان'}</span>
              </button>
            ))
          ) : (
            <p className="empty-history">تاریخچه چت برای این دامنه خالی است.</p>
          )}
        </div>
        <button className="sidebar-button support-button" onClick={onSupportClick}>
          <SupportIcon />
          <span>پشتیبانی</span>
        </button>
      </div>
    </div>
  );
} 