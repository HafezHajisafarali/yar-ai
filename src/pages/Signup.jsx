import { useState, useRef, useEffect } from "react";
import { useEffect as useEffectOriginal } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const steps = ['۱', '۲', '۳', '۴'];

  useEffect(() => {
    document.documentElement.style.setProperty('--progress', currentStep);
  }, [currentStep]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep === 1) {
      if (firstName && lastName) {
        try {
          console.log("🔍 Sending data:", { name: `${firstName.trim()} ${lastName.trim()}`, email: `${firstName.trim()}.${lastName.trim()}@mock.com` });
          console.log("🧪 Fetching", import.meta.env.VITE_API_BASE_URL);
          const res = await fetch(import.meta.env.VITE_API_BASE_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
              name: `${firstName.trim()} ${lastName.trim()}`,
              email: `${firstName.trim()}.${lastName.trim()}@mock.com`
            })
          });
          console.log("📥 Response status:", res.status);
          
          const data = await res.json();
          
          if (res.ok) {
            localStorage.setItem("yar_name", `${firstName.trim()} ${lastName.trim()}`);
            navigate("/social-signup");
          } else {
            console.error("Signup failed:", data.message || data.error);
            alert(data.message || "خطایی در ثبت‌نام رخ داده است.");
          }
        } catch (err) {
          console.error("❌ Signup error:", err);
          alert("مشکلی در ارتباط با سرور پیش آمد: " + err.message);
        }
      }
    } else if (currentStep === 4) {
      // TODO: Handle final submission
    }
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="form-group">
              <label>اسم کوچک</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="مثلاً علی"
                required
              />
            </div>

            <div className="form-group">
              <label>نام خانوادگی</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="مثلاً رضایی"
                required
              />
            </div>
          </>
        );
      case 4:
        return (
          <div className="form-group">
            <label>انتخاب رمز عبور</label>
            <input
              type="password"
              placeholder="رمز عبور"
              required
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="signup-container">
      <div className="form-wrapper">
        <h1>
          {currentStep === 1 && "به یار خوش اومدی!"}
          {currentStep === 4 && "انتخاب رمز عبور"}
        </h1>
        <div style={{ height: "1rem" }}></div>
        <p className="subtitle">
          {currentStep === 1 && "برای شروع، فقط اسمتو بنویس :)"}
          {currentStep === 4 && "لطفاً یک رمز عبور قوی انتخاب کنید"}
        </p>
        <div style={{ height: "1rem" }}></div>

        <form className="signup-form" onSubmit={handleSubmit}>
          {renderStep()}

          <button 
            type="submit" 
            className="signup-btn"
          >
            {currentStep === totalSteps ? "تایید" : "بریم مرحله بعد"}
          </button>

          {currentStep === 1 && (
            <button
              type="button"
              className="google-btn"
              style={{ width: '100%', padding: '12px', borderRadius: '6px', background: '#4285f4', color: 'white', fontWeight: 500, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '1rem' }}
              onClick={() => {
                const base = import.meta.env.VITE_API_URL || 'https://y4r.net/api';
                window.location.href = base + '/api/auth/google';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" fill="#FFC107"/>
                <path d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" fill="#FF3D00"/>
                <path d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" fill="#4CAF50"/>
                <path d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" fill="#1976D2"/>
              </svg>
              ادامه با گوگل
            </button>
          )}
          {currentStep === 1 && (
            <div className="signup-link">
              <span>قبلاً ثبت‌نام کردی؟</span>
              <a href="/login">همین حالا وارد شو</a>
            </div>
          )}
        </form>
      </div>
    </div>
  );

};

export default Signup;