import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SetPassword.css";

const SetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isPasswordReset, email, verificationCode } = location.state || {};

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // فقط در مسیر ثبت‌نام پروگرس‌بار نمایش داده می‌شود
  const currentStep = isPasswordReset ? null : 4;
  const steps = ['۱', '۲', '۳', '۴', '۵'];

  useEffect(() => {
    if (!isPasswordReset && currentStep) {
      document.documentElement.style.setProperty('--progress', currentStep);
    }
  }, [currentStep, isPasswordReset]);

  const validatePassword = () => {
    if (password.length < 8) {
      setPasswordError("رمز عبور باید حداقل ۸ کاراکتر باشد");
      return false;
    }
    if (!/\d/.test(password)) {
      setPasswordError("رمز عبور باید شامل حداقل یک عدد باشد");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setPasswordError("رمز عبور باید شامل حداقل یک حرف بزرگ باشد");
      return false;
    }
    if (!/[a-z]/.test(password)) {
      setPasswordError("رمز عبور باید شامل حداقل یک حرف کوچک باشد");
      return false;
    }
    if (password !== confirmPassword) {
      setPasswordError("رمز عبور و تکرار آن باید یکسان باشند");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validatePassword()) {
      if (isPasswordReset) {
        try {
          // در اینجا باید API تغییر رمز عبور صدا زده شود
          // برای مثال:
          // await resetPassword({ email, verificationCode, newPassword: password });
          navigate('/login', { 
            state: { 
              message: 'رمز عبور شما با موفقیت تغییر کرد. لطفاً وارد شوید.' 
            }
          });
        } catch (error) {
          setPasswordError('خطا در تغییر رمز عبور. لطفاً دوباره تلاش کنید.');
        }
      } else {
        // مسیر ثبت‌نام
        navigate('/theme-selection');
      }
    }
  };

  return (
    <div className="password-container">
      <h1>{isPasswordReset ? 'تغییر رمز عبور' : 'انتخاب رمز عبور'}</h1>
      <p className="subtitle">لطفاً یک رمز عبور قوی {isPasswordReset ? 'جدید ' : ''}انتخاب کنید</p>

      <form className="password-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>رمز عبور{isPasswordReset ? ' جدید' : ''}</label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
              placeholder={`رمز عبور${isPasswordReset ? ' جدید' : ''} خود را وارد کنید`}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>تکرار رمز عبور{isPasswordReset ? ' جدید' : ''}</label>
          <div className="password-input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setPasswordError("");
              }}
              placeholder={`رمز عبور${isPasswordReset ? ' جدید' : ''} را مجدداً وارد کنید`}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {passwordError && <span className="error-message">{passwordError}</span>}

        <div className="password-rules">
          <p>رمز عبور باید:</p>
          <ul>
            <li className={password.length >= 8 ? "valid" : ""}>
              حداقل ۸ کاراکتر باشد
            </li>
            <li className={/\d/.test(password) ? "valid" : ""}>
              شامل حداقل یک عدد باشد
            </li>
            <li className={/[A-Z]/.test(password) ? "valid" : ""}>
              شامل حداقل یک حرف بزرگ باشد
            </li>
            <li className={/[a-z]/.test(password) ? "valid" : ""}>
              شامل حداقل یک حرف کوچک باشد
            </li>
          </ul>
        </div>

        <button type="submit" className="submit-btn">
          {isPasswordReset ? 'تغییر رمز عبور' : 'ثبت رمز عبور'}
        </button>
      </form>
    </div>
  );
};

export default SetPassword;