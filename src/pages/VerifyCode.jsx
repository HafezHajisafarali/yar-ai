import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './VerifyCode.css';

function VerifyCode() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(120);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Focus on first input on mount
    inputRefs.current[0]?.focus();

    // Start timer
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toPersianNumber = (str) => {
    if (!str) return '';
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return str.toString().replace(/[0-9]/g, (d) => persianNumbers[d]);
  };

  const handleChange = (index, value) => {
    // اگر عدد فارسی وارد شده، به انگلیسی تبدیل کن
    value = value.replace(/[۰-۹]/g, d => String.fromCharCode(d.charCodeAt(0) - 1728));
    
    // فقط اعداد را قبول کن
    value = value.replace(/\D/g, '');

    // فقط یک عدد را قبول کن
    if (value.length > 1) {
      value = value.slice(-1);
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // اگر عدد وارد شده و فیلد بعدی وجود دارد، فوکوس را به آن منتقل کن
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    // اگر همه فیلدها پر شدند، به صفحه بعد برو
    if (newCode.every(digit => digit !== '') && index === 5) {
      setTimeout(() => {
        navigate('/theme-selection');
      }, 300);
    }
  };

  const handleKeyDown = (index, e) => {
    // در صورت فشردن backspace در فیلد خالی، به فیلد قبلی برو
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = [...code];
    
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    
    setCode(newCode);
    
    if (pastedData.length === 6) {
      setTimeout(() => {
        navigate('/theme-selection');
      }, 300);
    } else {
      // اگر کد کامل نیست، فوکوس را به اولین فیلد خالی منتقل کن
      const firstEmptyIndex = newCode.findIndex(digit => !digit);
      if (firstEmptyIndex !== -1) {
        inputRefs.current[firstEmptyIndex].focus();
      }
    }
  };

  const handleResend = () => {
    setTimeLeft(120);
    setCode(['', '', '', '', '', '']);
    inputRefs.current[0].focus();
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        <h1 className="verify-title">
          کد تایید رو وارد کن
        </h1>
        
        <p className="verify-subtitle">
          کد ۶ رقمی به شماره موبایلت پیامک شد
        </p>

        <form className="verify-form" onSubmit={(e) => e.preventDefault()}>
          <div className="code-input-container">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="code-input"
                autoComplete="off"
              />
            ))}
          </div>

          <div className="resend-section">
            {timeLeft > 0 ? (
              <div className="timer">
                <span>{toPersianNumber(formatTime(timeLeft))}</span>
                <span className="timer-text"> مانده تا ارسال مجدد</span>
              </div>
            ) : (
              <button 
                type="button"
                onClick={handleResend} 
                className="resend-button"
              >
                ارسال مجدد کد
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerifyCode;