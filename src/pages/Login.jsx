import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

// Simple email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (!email || !password) {
      setError("لطفاً ایمیل و رمز عبور را وارد کنید");
      return;
    }
    
    if (!EMAIL_REGEX.test(email)) {
      setError("لطفاً یک ایمیل معتبر وارد کنید");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch("https://api.yourdomain.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "خطا در ورود به سیستم");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("yar_email", data.email);
      localStorage.setItem("yar_name", data.name || "کاربر یار");

      setIsLoading(false);
      navigate("/dashboard");
    } catch (err) {
      setError("خطا در اتصال به سرور");
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="form-wrapper">
        <h1>ورود به حساب کاربری</h1>
        <p className="subtitle">لطفا ایمیل و رمز عبور خود را وارد کنید</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">ایمیل</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">رمز عبور</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور خود را وارد کنید"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              "ورود به حساب کاربری"
            )}
          </button>
        </form>

        <div className="signup-link">
          <p>حساب کاربری ندارید؟ <Link to="/signup">ثبت‌نام</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;