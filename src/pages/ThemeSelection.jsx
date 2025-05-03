import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ThemeSelection.css';

const ThemeSelection = () => {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const navigate = useNavigate();
  const currentStep = 5;
  const steps = ['۱', '۲', '۳', '۴', '۵'];

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedTheme) {
      // Here you would typically save the theme preference
      console.log('Selected theme:', selectedTheme);
      navigate('/dashboard');
    }
  };

  return (
    <div className="theme-container">
      <div className="theme-box">
        <h1 className="theme-title">
          تم مورد علاقه‌ات رو انتخاب کن
        </h1>
        
        <p className="theme-subtitle">
          بعداً هم می‌تونی از تنظیمات تغییرش بدی
        </p>

        <form onSubmit={handleSubmit} className="theme-form">
          <div className="themes-grid">
            <button
              type="button"
              className={`theme-option light ${selectedTheme === 'light' ? 'selected' : ''}`}
              onClick={() => handleThemeSelect('light')}
            >
              <div className="theme-preview light-preview">
                <div className="preview-header"></div>
                <div className="preview-content">
                  <div className="preview-line"></div>
                  <div className="preview-line short"></div>
                </div>
              </div>
              <span className="theme-label">روشن</span>
            </button>

            <button
              type="button"
              className={`theme-option dark disabled`}
              disabled
            >
              <div className="coming-soon-tag">به زودی</div>
              <div className="theme-preview dark-preview">
                <div className="preview-header"></div>
                <div className="preview-content">
                  <div className="preview-line"></div>
                  <div className="preview-line short"></div>
                </div>
              </div>
              <span className="theme-label">تیره</span>
            </button>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={!selectedTheme}
          >
            ورود به یار
          </button>
        </form>
      </div>
    </div>
  );
};

export default ThemeSelection;