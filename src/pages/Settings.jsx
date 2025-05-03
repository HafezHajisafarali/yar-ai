import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [lastSavedData, setLastSavedData] = useState({
    firstName: 'محمد',
    lastName: 'عزیز',
    email: 'mohammad@example.com'
  });
  const [userData, setUserData] = useState(lastSavedData);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    // اینجا می‌تونید لاجیک ذخیره تغییرات رو اضافه کنید
    console.log('Saving profile changes:', userData);
    setLastSavedData(userData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setUserData(lastSavedData);
    setIsEditing(false);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="settings-container">
      <header className="settings-header">
        <button className="back-button" onClick={handleBack}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          بازگشت
        </button>
        <h1 className="settings-title">تنظیمات</h1>
      </header>

      <div className="settings-content">
        <div className="settings-sidebar">
          <button 
            className={`sidebar-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            پروفایل
          </button>
          <button 
            className={`sidebar-button ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            حساب کاربری
          </button>
          <button 
            className={`sidebar-button ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            اعلان‌ها
          </button>
          <button 
            className={`sidebar-button ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            حریم خصوصی
          </button>
        </div>

        <div className="settings-main">
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h2>پروفایل</h2>
              <div className="form-group">
                <label>نام</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleInputChange}
                  placeholder="نام خود را وارد کنید" 
                  readOnly={!isEditing}
                  className={!isEditing ? 'readonly' : ''}
                />
              </div>
              <div className="form-group">
                <label>نام خانوادگی</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleInputChange}
                  placeholder="نام خانوادگی خود را وارد کنید" 
                  readOnly={!isEditing}
                  className={!isEditing ? 'readonly' : ''}
                />
              </div>
              <div className="form-group">
                <label>ایمیل</label>
                <input 
                  type="email" 
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  placeholder="ایمیل خود را وارد کنید" 
                  readOnly={!isEditing}
                  className={!isEditing ? 'readonly' : ''}
                />
              </div>
              {!isEditing ? (
                <button className="edit-button" onClick={handleEditProfile}>تغییر اطلاعات</button>
              ) : (
                <div className="button-group">
                  <button className="save-button" onClick={handleSaveProfile}>ذخیره تغییرات</button>
                  <button className="cancel-button" onClick={handleCancelEdit}>انصراف</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'account' && (
            <div className="settings-section">
              <h2>حساب کاربری</h2>
              <div className="form-group">
                <label>رمز عبور فعلی</label>
                <div className="password-input-container">
                  <input 
                    type={showPasswords.current ? "text" : "password"} 
                    placeholder="رمز عبور فعلی را وارد کنید" 
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={() => togglePasswordVisibility('current')}
                    aria-label={showPasswords.current ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
                  >
                    {showPasswords.current ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>رمز عبور جدید</label>
                <div className="password-input-container">
                  <input 
                    type={showPasswords.new ? "text" : "password"} 
                    placeholder="رمز عبور جدید را وارد کنید" 
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={() => togglePasswordVisibility('new')}
                    aria-label={showPasswords.new ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
                  >
                    {showPasswords.new ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>تکرار رمز عبور جدید</label>
                <div className="password-input-container">
                  <input 
                    type={showPasswords.confirm ? "text" : "password"} 
                    placeholder="رمز عبور جدید را تکرار کنید" 
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={() => togglePasswordVisibility('confirm')}
                    aria-label={showPasswords.confirm ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
                  >
                    {showPasswords.confirm ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <button className="save-button">تغییر رمز عبور</button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>اعلان‌ها</h2>
              <div className="notification-option">
                <div className="notification-info">
                  <h3>اعلان‌های ایمیلی</h3>
                  <p>دریافت اعلان‌ها از طریق ایمیل</p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="notification-option">
                <div className="notification-info">
                  <h3>اعلان‌های مرورگر</h3>
                  <p>دریافت اعلان‌ها در مرورگر</p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="settings-section">
              <h2>حریم خصوصی</h2>
              <div className="privacy-option">
                <div className="privacy-info">
                  <h3>نمایش وضعیت آنلاین</h3>
                  <p>اجازه به دیگران برای دیدن وضعیت آنلاین شما</p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="privacy-option">
                <div className="privacy-info">
                  <h3>اشتراک‌گذاری فعالیت‌ها</h3>
                  <p>اجازه به دیگران برای دیدن فعالیت‌های شما</p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;