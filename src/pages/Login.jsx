import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { authService } from "../services/api";

// Simple email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple phone validation regex for Iran
const PHONE_REGEX = /^09[0-9]{9}$/;

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.1711 8.36788H17.5V8.33333H10V11.6667H14.7367C14.0044 13.6071 12.1711 15 10 15C7.23889 15 5 12.7611 5 10C5 7.23889 7.23889 5 10 5C11.2756 5 12.4389 5.48667 13.3178 6.28556L15.7089 3.89444C14.1711 2.48889 12.2044 1.66667 10 1.66667C5.39778 1.66667 1.66667 5.39778 1.66667 10C1.66667 14.6022 5.39778 18.3333 10 18.3333C14.6022 18.3333 18.3333 14.6022 18.3333 10C18.3333 9.43333 18.2756 8.89444 18.1711 8.36788Z" fill="#FFC107"/>
      <path d="M2.62891 6.12222L5.45002 8.22222C6.18224 6.33889 7.93224 5 10 5C11.2756 5 12.4389 5.48667 13.3178 6.28556L15.7089 3.89444C14.1711 2.48889 12.2045 1.66667 10 1.66667C6.79224 1.66667 4.02891 3.47333 2.62891 6.12222Z" fill="#FF3D00"/>
      <path d="M10 18.3333C12.1511 18.3333 14.0756 17.5533 15.5956 16.2178L13.0045 13.9867C12.1579 14.6178 11.1157 15 10 15C7.83779 15 5.99557 13.6133 5.25557 11.6667L2.51113 13.8089C3.89001 16.5089 6.67779 18.3333 10 18.3333Z" fill="#4CAF50"/>
      <path d="M18.1711 8.36788H17.5V8.33333H10V11.6667H14.7367C14.3889 12.5911 13.7756 13.3911 12.9956 13.9867L12.9978 13.9856L15.5889 16.2167C15.4067 16.3833 18.3333 14.1667 18.3333 10C18.3333 9.43333 18.2756 8.89444 18.1711 8.36788Z" fill="#1976D2"/>
    </svg>
  );
}

function EyeIcon({ open }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      {open ? (
        <path d="M10 4.37C3.75 4.37 1.25 10 1.25 10C1.25 10 3.75 15.63 10 15.63C16.25 15.63 18.75 10 18.75 10C18.75 10 16.25 4.37 10 4.37ZM10 13.75C7.93 13.75 6.25 12.07 6.25 10C6.25 7.93 7.93 6.25 10 6.25C12.07 6.25 13.75 7.93 13.75 10C13.75 12.07 12.07 13.75 10 13.75ZM10 7.5C8.62 7.5 7.5 8.62 7.5 10C7.5 11.38 8.62 12.5 10 12.5C11.38 12.5 12.5 11.38 12.5 10C12.5 8.62 11.38 7.5 10 7.5Z" fill="currentColor"/>
      ) : (
        <path d="M10 4.37C3.75 4.37 1.25 10 1.25 10C1.25 10 3.75 15.63 10 15.63C16.25 15.63 18.75 10 18.75 10C18.75 10 16.25 4.37 10 4.37ZM10 13.75C7.93 13.75 6.25 12.07 6.25 10C6.25 7.93 7.93 6.25 10 6.25C12.07 6.25 13.75 7.93 13.75 10C13.75 12.07 12.07 13.75 10 13.75Z" fill="currentColor"/>
      )}
    </svg>
  );
}

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("Google Sign In Success:", credentialResponse);
    setError("");
    setIsLoading(true);
    
    try {
      // استفاده از اتصال به API شبیه‌سازی شده
      const response = await authService.googleLogin(credentialResponse.credential);
      console.log("Server login response:", response);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('yar_email', response.data.email || "user@example.com");
      localStorage.setItem('yar_name', response.data.name || "کاربر یار");
      localStorage.setItem('yar_picture', response.data.picture || "");
      
      setIsLoading(false);
      navigate('/dashboard');
    } catch (err) {
      console.error("Google login error:", err);
      
      if (err.response) {
        console.error("Error details:", err.response.data);
        // اگر کاربر وجود نداشته باشد، به صفحه ثبت‌نام هدایت می‌شود
        if (err.response.status === 404 || 
            (err.response.data && 
             (err.response.data.message === "User not found" || 
              err.response.data.error === "User not found"))) {
          setError("حساب کاربری شما یافت نشد. لطفا ابتدا ثبت‌نام کنید.");
          setTimeout(() => {
            navigate('/social-signup');
          }, 2000);
          return;
        }
        
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

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 11) {
      setPhone(value);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>ورود به حساب کاربری</h1>
        <p>لطفا با استفاده از حساب گوگل وارد شوید</p>
      </div>
      
      <div className="social-login-options">
        <div className="google-login-wrapper">
          <button
            className="google-btn"
            onClick={() => {
              window.location.href = import.meta.env.VITE_API_URL + '/auth/google';
            }}
            style={{ width: '100%', padding: '12px', borderRadius: '6px', background: '#4285f4', color: 'white', fontWeight: 500, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          >
            <GoogleIcon />
            ورود با گوگل
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {isLoading && <div className="loading-spinner"></div>}
      </div>
      
      <div className="signup-link">
        <p>حساب کاربری ندارید؟ <span onClick={() => navigate('/social-signup')}>ثبت‌نام</span></p>
      </div>
    </div>
  );
};

export default Login;