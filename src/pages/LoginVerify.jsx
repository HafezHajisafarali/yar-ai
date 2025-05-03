import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './LoginVerify.css';
import { authService } from '../services/api';

function LoginVerify() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const phoneNumber = location.state?.phoneNumber || 'شماره شما';

  useEffect(() => {
    inputRefs.current[0]?.focus();
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${secs.toString().padStart(2, '0')}`;
  };

  const toPersianNumber = (str) => {
    if (!str) return '';
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return str.toString().replace(/[0-9]/g, (d) => persianNumbers[d]);
  };

  const handleChange = (index, value) => {
    setError('');
    value = value.replace(/[^0-9]/g, '');
    
    if (value.length > 1) {
      value = value.slice(-1);
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      setError('');
    }
    
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    setError('');
    
    const pastedData = e.clipboardData.getData('text');
    const numbers = pastedData.replace(/[^0-9]/g, '').split('').slice(0, 6);
    
    if (numbers.length === 6) {
      const newCode = [...numbers];
      setCode(newCode);
      inputRefs.current[5].focus();
    }
  };

  const handleResendCode = async () => {
    if (timeLeft > 0 || isResending) return;

    setError('');
    setIsResending(true);

    try {
      await authService.login(phoneNumber);
      setTimeLeft(60);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
      setIsResending(false);
    } catch (err) {
      console.error("Resend code error:", err);
      setError(err.response?.data?.message || "خطا در ارسال مجدد کد.");
      setIsResending(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    const submittedCode = code.join("");

    if (submittedCode.length !== 6) {
      setError('کد تایید باید ۶ رقم باشد.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.verifyCode(phoneNumber, submittedCode);
      console.log("Verification successful:", response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      navigate('/dashboard');
    } catch (err) {
      console.error("Verification error:", err);
      setError(err.response?.data?.message || "کد وارد شده صحیح نیست.");
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
      setIsLoading(false);
    }
  };

  const isCodeComplete = code.every(digit => digit !== '');

  useEffect(() => {
    if (code.every(d => d !== '') && !isLoading && !isResending) {
      handleSubmit();
    }
  }, [code]);

  return (
    <div className="verify-container">
      <h1>کد تایید رو وارد کن</h1>
      <p className="phone-number">کد ۶ رقمی به شماره موبایلت پیامک شد</p>

      <form onSubmit={handleSubmit}>
        <div className="code-inputs">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className={error ? 'error' : ''}
              aria-label={`رقم ${index + 1} کد تایید`}
              disabled={isLoading || isResending}
            />
          ))}
        </div>

        {error && <p className="verify-error-message">{error}</p>}
        
        <div className="timer-container">
          {timeLeft > 0 ? (
            <span className="timer"><span className="timer-count">{toPersianNumber(formatTime(timeLeft))}</span> مانده تا ارسال مجدد</span>
          ) : (
            <button
              type="button"
              className="resend-button"
              onClick={handleResendCode}
              disabled={isResending}
            >
              {isResending ? (
                <span className="loading-spinner-small"></span>
              ) : (
                'ارسال مجدد کد تایید'
              )}
            </button>
          )}
        </div>
      </form>

      <div className="change-phone-container">
        <span className="change-phone-text">شماره خود را اشتباه وارد کردید؟</span>
        <span className="change-phone-link" onClick={() => navigate('/login')}>
          تغییر شماره تلفن
        </span>
      </div>
    </div>
  );
}

export default LoginVerify;