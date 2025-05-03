import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'کاربر مهمان',
    avatarUrl: null 
  });
  
  // بارگذاری اطلاعات کاربر از localStorage
  useEffect(() => {
    const storedName = localStorage.getItem('yar_name');
    const storedPicture = localStorage.getItem('yar_picture');
    
    if (storedName || storedPicture) {
      setUser({
        name: storedName || 'کاربر مهمان',
        avatarUrl: storedPicture || null
      });
    }
  }, []);
  
  const domains = [
    {
      id: 'text-generation',
      title: 'تولید متن',
      icon: '/icons/text-generation.svg',
      description: 'تولید متن‌های خلاقانه با هوش مصنوعی'
    },
    {
      id: 'summarize',
      title: 'خلاصه‌سازی',
      icon: '/icons/summarize.svg',
      description: 'خلاصه کردن متن‌های طولانی'
    },
    {
      id: 'grammar-correction',
      title: 'تصحیح گرامر',
      icon: '/assets/icons/grammar.svg',
      description: 'اصلاح جملات با رعایت دستور زبان'
    },
    {
      id: 'translation',
      title: 'ترجمه',
      icon: '/assets/icons/translation.svg',
      description: 'ترجمه متن به زبان‌های مختلف'
    },
  ];

  const mainChat = {
    id: 'mainchat',
    title: 'چت هوشمند',
    icon: '/icons/chat.svg',
    description: 'چت هوشمند با هوش مصنوعی'
  };

  const handleDomainClick = (domain) => {
    switch (domain.id) {
      case 'text-generation':
        navigate('/text-generator');
        break;
      case 'summarize':
        navigate('/summarize');
        break;
      case 'grammar-correction':
        navigate('/grammar');
        break;
      case 'translation':
        navigate('/translation');
        break;
    }
  };

  const handleMainChatClick = () => {
    navigate('/mainchat');
  };

  const handleSignOut = () => {
    // پاک کردن اطلاعات کاربر از localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('yar_email');
    localStorage.removeItem('yar_name');
    localStorage.removeItem('yar_picture');
    localStorage.removeItem('chatHistory');

    navigate('/login');
  };

  const handleSupport = () => {
    // اینجا منطق پشتیبانی پیاده‌سازی می‌شود
    window.open('https://support.yarai.com', '_blank');
  };

  // Function to get user initial
  const getUserInitial = (name) => {
    if (!name) return '?';
    return name.trim()[0].toUpperCase();
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-actions">
          <button className="text-button" onClick={handleSupport}>
            پشتیبانی
          </button>
          <button className="text-button" onClick={() => navigate('/settings')}>
            تنظیمات
          </button>
          <button className="text-button" onClick={handleSignOut}>
            خروج
          </button>
        </div>
        <div className="user-info">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="user-avatar image-avatar" />
          ) : (
            <div className="user-avatar initial-avatar">
              {getUserInitial(user.name)}
            </div>
          )}
          {/* Optionally display user name next to avatar */}
          {/* <span className="user-name">{user.name}</span> */} 
        </div>
      </header>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h1 className="welcome-text">سلام{user.name !== 'کاربر مهمان' ? ` ${user.name}` : ''}!</h1>
          <p className="welcome-subtitle">به پلتفرم هوش مصنوعی یار خوش آمدید.</p>
        </div>

        {/* Main Chat Section */}
        <div className="main-chat-section">
          <div 
            className="main-chat-card"
            onClick={handleMainChatClick}
          >
            <span className="coming-soon-badge">به زودی</span>
            <img src={mainChat.icon} alt={mainChat.title} className="main-chat-icon" />
            <div className="main-chat-info">
              <h2 className="main-chat-title">{mainChat.title}</h2>
              <p className="main-chat-description">{mainChat.description}</p>
            </div>
          </div>
        </div>

        <h2 className="section-heading">ابزارهای هوش مصنوعی</h2>
        <div className="domains-grid">
          {domains.map((domain) => (
            <div 
              key={domain.id}
              className="domain-card"
              onClick={() => handleDomainClick(domain)}
            >
              <img src={domain.icon} alt={domain.title} className="domain-icon" />
              <div className="domain-info">
                <h3 className="domain-title">{domain.title}</h3>
                <p className="domain-description">{domain.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="dashboard-footer">
        <p>پاسخ‌های یار همیشه دقیق نیست؛ حتماً دوباره بررسی کنید!</p>
      </footer>
    </div>
  );
}