import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PhoneVerification.css';

function PhoneVerification() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('98');

  const navigate = useNavigate();

  const countries = [
    { code: '98', name: 'Iran', flag: '🇮🇷' },
    { code: '93', name: 'Afghanistan', flag: '🇦🇫' },
    { code: '90', name: 'Turkey', flag: '🇹🇷' },
    { code: '964', name: 'Iraq', flag: '🇮🇶' },
    { code: '971', name: 'UAE', flag: '🇦🇪' },
    { code: '966', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: '92', name: 'Pakistan', flag: '🇵🇰' },
    { code: '91', name: 'India', flag: '🇮🇳' },
    { code: '994', name: 'Azerbaijan', flag: '🇦🇿' },
    { code: '374', name: 'Armenia', flag: '🇦🇲' },
    { code: '7', name: 'Russia', flag: '🇷🇺' },
    { code: '20', name: 'Egypt', flag: '🇪🇬' },
    { code: '961', name: 'Lebanon', flag: '🇱🇧' },
    { code: '963', name: 'Syria', flag: '🇸🇾' },
    { code: '962', name: 'Jordan', flag: '🇯🇴' },
    { code: '974', name: 'Qatar', flag: '🇶🇦' },
    { code: '973', name: 'Bahrain', flag: '🇧🇭' },
    { code: '965', name: 'Kuwait', flag: '🇰🇼' },
    { code: '968', name: 'Oman', flag: '🇴🇲' },
    { code: '967', name: 'Yemen', flag: '🇾🇪' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber.length === 10) {
      navigate('/verify-code');
    }
  };

  const toPersianNumber = (str) => {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return str.toString().replace(/[0-9]/g, (d) => persianNumbers[d]);
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    
    // اگر عدد فارسی وارد شده، به انگلیسی تبدیل کن
    value = value.replace(/[۰-۹]/g, d => String.fromCharCode(d.charCodeAt(0) - 1728));
    
    // فقط اعداد رو نگه دار
    value = value.replace(/\D/g, '');
    
    // محدود کردن به 10 رقم
    if (value.length <= 10) {
      setPhoneNumber(value);
    }
  };

  const handleCountryChange = (e) => {
    setCountryCode(e.target.value);
  };

  return (
    <div className="verify-container">
      <div className="progress-bar">
        <div className="progress-step active"></div>
        <div className="progress-step active"></div>
        <div className="progress-step"></div>
        <div className="progress-step"></div>
      </div>

      <div className="verify-card">
        <h1 className="verify-title">
          شماره موبایلت رو وارد کن
        </h1>
        
        <p className="verify-subtitle">
          کد تایید رو برات پیامک می‌کنیم
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <select 
              value={countryCode}
              onChange={handleCountryChange}
              className="country-select"
            >
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name} +{country.code}
                </option>
              ))}
            </select>
          </div>
          <div className="input-container">
            <input
              type="text"
              inputMode="numeric"
              className="phone-input"
              value={toPersianNumber(phoneNumber)}
              onChange={handlePhoneChange}
              placeholder="۹۱۲۳۴۵۶۷۸۹"
              dir="rtl"
            />
          </div>

          <p className="keyboard-note">
            لطفا از کیبورد انگلیسی استفاده کنید
          </p>

          <button 
            type="submit"
            className="verify-button"
            disabled={phoneNumber.length !== 10}
          >
            ادامه
          </button>
        </form>
      </div>
    </div>
  );
}

export default PhoneVerification;