import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import "./VerifyPhone.css";

const VerifyPhone = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState(false);
  const email = localStorage.getItem("yar_email");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidPhoneNumber(phoneNumber)) {
      setError(true);
      return;
    }
    setError(false);
    try {
      console.log("📦 email:", email);
      console.log("📞 Sending:", { phone: phoneNumber, email });
      const response = await fetch("http://localhost:5050/api/auth/verify-phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phone: phoneNumber, email })
      });

      const data = await response.json();
      console.log("✅ Phone submitted:", data);
      if (response.ok) {
        navigate("/verify-code");
      } else {
        alert(data.message || "خطا در ثبت شماره");
      }
    } catch (error) {
      console.error("❌ Phone submit error:", error);
      alert("خطا در اتصال به سرور");
    }
  };

  return (
    <div className="verify-phone-container">
      <div className="verify-phone-box">
        <h1>تایید شماره تلفن</h1>
        <p className="subtitle">لطفا شماره تلفن همراه خود را وارد کنید</p>

        <form className="verify-phone-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="phone-input-container">
              <PhoneInput
                international
                defaultCountry="IR"
                value={phoneNumber}
                onChange={(value) => {
                  setPhoneNumber(value || "");
                  setError(value ? !isValidPhoneNumber(value) : true);
                }}
                name="phone"
                required
                autoFocus
                className={`modern-phone-input ${error ? "error" : ""}`}
              />
              {phoneNumber && (
                <button
                  type="button"
                  className="clear-phone"
                  onClick={() => setPhoneNumber("")}
                  aria-label="پاک کردن شماره"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="verify-btn"
            disabled={!isValidPhoneNumber(phoneNumber)}
          >
            دریافت کد تایید
          </button>
        </form>

        <button
          className="back-btn"
          onClick={() => navigate("/signup")}
        >
          بازگشت
        </button>
      </div>
    </div>
  );
};

export default VerifyPhone;