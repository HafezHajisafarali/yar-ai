import React from 'react';
import './HistorySidebar.css';

interface ChatHistoryItem {
  id: string;
  title: string;
  timestamp: number;
  domain: string;
}

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  chatHistory: ChatHistoryItem[];
  onSelectChat: (id: string) => void;
  currentChatId: string | null;
  onDeleteChat: (id: string) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({
  isOpen,
  onClose,
  chatHistory,
  onSelectChat,
  currentChatId,
  onDeleteChat
}) => {
  // Format relative time (e.g., "2 days ago")
  const formatRelativeTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} ${days === 1 ? 'יום' : 'ימים'} לפני`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? 'שעה' : 'שעות'} לפני`;
    } else if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? 'דקה' : 'דקות'} לפני`;
    } else {
      return 'עכשיו';
    }
  };

  const getDomainDisplay = (domain: string): string => {
    switch (domain) {
      case 'translation':
        return 'תרגום';
      case 'grammar':
        return 'תיקון דקדוק';
      case 'summarization':
        return 'סיכום טקסט';
      case 'text-generation':
        return 'יצירת טקסט';
      default:
        return 'צ׳אט';
    }
  };

  const getIconForDomain = (domain: string): string => {
    switch (domain) {
      case 'translation':
        return '🌐';
      case 'grammar':
        return '📝';
      case 'summarization':
        return '📋';
      case 'text-generation':
        return '✍️';
      default:
        return '💬';
    }
  };

  return (
    <div className={`history-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2>היסטוריית שיחות</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <div className="history-list">
        {chatHistory.length === 0 ? (
          <div className="empty-history">
            <p>אין שיחות שמורות</p>
          </div>
        ) : (
          chatHistory.sort((a, b) => b.timestamp - a.timestamp).map((chat) => (
            <div 
              key={chat.id} 
              className={`history-item ${chat.id === currentChatId ? 'active' : ''}`}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="history-item-icon">
                {getIconForDomain(chat.domain)}
              </div>
              <div className="history-item-content">
                <div className="history-item-title">
                  {chat.title}
                </div>
                <div className="history-item-meta">
                  <span className="history-item-type">{getDomainDisplay(chat.domain)}</span>
                  <span className="history-item-time">{formatRelativeTime(chat.timestamp)}</span>
                </div>
              </div>
              <button 
                className="delete-chat-button" 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      <div className="sidebar-footer">
        <a href="#support" className="support-link">צריכים עזרה?</a>
      </div>
    </div>
  );
};

export default HistorySidebar; 