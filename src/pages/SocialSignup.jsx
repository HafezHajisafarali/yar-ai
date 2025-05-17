import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import './SocialSignup.css';

// Google Logo SVG
function GoogleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" fill="#FFC107"/>
      <path d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" fill="#FF3D00"/>
      <path d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" fill="#4CAF50"/>
      <path d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" fill="#1976D2"/>
    </svg>
  );
}

// Arrow Icon
function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function SocialSignup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("Google Sign In Success:", credentialResponse);
    setError("");
    setIsLoading(true);
    
    try {
      // استفاده از اتصال به API شبیه‌سازی شده
      const response = await authService.googleSignup(credentialResponse.credential);
      console.log("Server signup response:", response);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('yar_email', response.data.email || "user@example.com");
      localStorage.setItem('yar_name', response.data.name || "کاربر یار");
      localStorage.setItem('yar_picture', response.data.picture || "");
      
      setIsLoading(false);
      navigate('/theme-selection');
    } catch (err) {
      console.error("Google signup error:", err);
      
      if (err.response) {
        console.error("Error details:", err.response.data);
        setError(`خطا: ${err.response.data.message || err.response.data.error || "ورود با گوگل ناموفق بود"}`);
      } else {
        setError("خطا در برقراری ارتباط با سرور. لطفاً دوباره تلاش کنید.");
      }
      
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error("Google Sign In Failed");
    setError("ورود با گوگل ناموفق بود. لطفاً دوباره تلاش کنید.");
    setIsLoading(false);
  };

  const navigateToLogin = () => {
    navigate('/login');
  };
  
  return (
    <div className="social-signup-container">
      <div className="social-signup-header">
        <h1>ثبت‌نام</h1>
        <p>لطفاً با استفاده از حساب گوگل ثبت‌نام کنید</p>
      </div>
      
      <div className="social-buttons-container">
        <div className="google-login-wrapper">
          <button
            className="google-btn"
            onClick={() => {
              window.location.href = 'http://y4r.net/api/auth/google';
            }}
            style={{ width: '100%', padding: '12px', borderRadius: '6px', background: '#4285f4', color: 'white', fontWeight: 500, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          >
            <GoogleLogo />
            Continue with Google
          </button>
        </div>
      </div>
      
      {isLoading && <div className="loading-spinner"></div>}
      {error && <div className="error-message">{error}</div>}
      
      <div className="login-option">
        <span>حساب کاربری دارید؟</span>
        <button onClick={navigateToLogin}>ورود</button>
      </div>
    </div>
  );
}