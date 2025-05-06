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

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: "408482867426-gb5vpue5a328g7nkraq9lg0v3rhok48i.apps.googleusercontent.com",
        callback: handleGoogleSuccess,
      });

      google.accounts.id.renderButton(
        document.getElementById("google-signin-btn"),
        { theme: "outline", size: "large" }
      );
    }
  }, []);

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log(credentialResponse);
    try {
      const res = await fetch("https://four-cases-buy.loca.lt/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ credential: credentialResponse.credential, isNewUser: true })
      });
      const data = await res.json();
      if (res.ok) {
        console.log("Google login successful:", data);
        localStorage.setItem("yar_name", data.name);
        navigate('/dashboard');
      } else {
        console.error("Google login failed:", data.message || data.error);
        alert(data.message || "خطایی در ورود با گوگل رخ داده است.");
      }
    } catch (err) {
      console.error("❌ Google login error:", err);
      alert("مشکلی در ارتباط با سرور پیش آمد: " + err.message);
    }
  };

  const handleGoogleError = () => {
    console.log('Login Failed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep === 1) {
      if (firstName && lastName) {
        try {
          console.log("🔍 Sending data:", { name: `${firstName.trim()} ${lastName.trim()}`, email: `${firstName.trim()}.${lastName.trim()}@mock.com` });
          console.log("🧪 Fetching https://four-cases-buy.loca.lt/api");
          const res = await fetch("https://four-cases-buy.loca.lt/api", {
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
            disabled={currentStep === 4}
          >
            {currentStep === totalSteps ? "تایید" : "بریم مرحله بعد"}
          </button>

          {currentStep === 1 && (
            <div id="google-signin-btn" style={{ marginTop: '1rem' }}></div>
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