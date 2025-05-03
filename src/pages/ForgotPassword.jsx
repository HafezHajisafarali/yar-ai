import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

// Simple email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState(['','','','','','','','']);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(180); // 3 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [resendMessage, setResendMessage] = useState(''); // Resend confirmation message
  const inputRefs = useRef([]);

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError('');
    setResendMessage('');

    // 1. Validate Email
    if (!EMAIL_REGEX.test(email)) {
      setError('لطفاً یک ایمیل معتبر وارد کنید.');
      return;
    }

    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setStep(2);
      setTimer(180);
      setIsTimerRunning(true);
      setIsLoading(false);
    }, 500); // Simulate 0.5 second delay
  };

  const handleVerificationSubmit = (e) => {
    e.preventDefault();
    const code = verificationCode.join('');
    setError('');
    setResendMessage('');

    if (code.length !== 8) {
      setError('کد تایید باید ۸ کاراکتر باشد');
      return;
    }
    
    setIsLoading(true);
    // Simulate API check delay
    setTimeout(() => {
      // Assuming code is correct for now
      console.log("Verification successful");
      setIsLoading(false);
      navigate('/set-password', { 
        state: { 
          email,
          isPasswordReset: true,
          verificationCode: code
        } 
      });
    }, 500); // Simulate 0.5 second delay
  };

  const handleCodeChange = (index, value) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode];
      newCode[index] = value.toUpperCase();
      setVerificationCode(newCode);
      
      // Move to next input if value is entered
      if (value && index < 7) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResendCode = () => {
    if (!isTimerRunning && !isLoading) { // Also check isLoading
      // 2. Show resend message
      setResendMessage('کد مجدداً ارسال شد');
      setTimeout(() => setResendMessage(''), 3000); // Clear message after 3 seconds
      
      setTimer(180);
      setIsTimerRunning(true);
      setVerificationCode(['','','','','','','','']);
      setError('');
      // Simulate API call for resend if needed
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h1 className="title">بازیابی رمز عبور</h1>
        
        {step === 1 ? (
          <>
            <p className="description">
              لطفا ایمیل خود را وارد کنید. ما یک کد تایید ۸ کاراکتری برای شما ارسال خواهیم کرد.
            </p>
            <form onSubmit={handleEmailSubmit}>
              <div className="form-group">
                <label className="form-label">ایمیل</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ایمیل خود را وارد کنید"
                  required
                />
              </div>
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="submit-button" disabled={isLoading}>
                {isLoading ? 'در حال ارسال...' : 'ارسال کد تایید'}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="description">
              کد تایید ۸ کاراکتری به ایمیل {email} ارسال شد.
            </p>
            <form onSubmit={handleVerificationSubmit}>
              <div className="verification-boxes">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    className={`verification-box ${error ? 'error' : ''}`}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    required
                  />
                ))}
              </div>
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="submit-button" disabled={isLoading}>
                {isLoading ? 'در حال تایید...' : 'تایید کد'}
              </button>
              <div className="resend-section">
                <button
                  type="button"
                  className={`resend-button ${isTimerRunning || isLoading ? 'disabled' : ''}`}
                  onClick={handleResendCode}
                  disabled={isTimerRunning || isLoading}
                >
                  {isTimerRunning ? (
                    <>ارسال مجدد کد ({formatTime(timer)})</>
                  ) : (
                    'ارسال مجدد کد'
                  )}
                </button>
                {resendMessage && <p className="resend-message">{resendMessage}</p>}
              </div>
            </form>
          </>
        )}

        <div className="back-to-login">
          <Link to="/login">بازگشت به صفحه ورود</Link>
        </div>
      </div>
    </div>
  );
}