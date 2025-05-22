import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup"; // دقت کن حرف S بزرگه
import Login from "./pages/Login";
import VerifyPhone from "./pages/VerifyPhone";
import VerifyCode from "./pages/VerifyCode";
import AdminDashboard from './pages/Admin/AdminDashboard';
import ThemeSelection from "./pages/ThemeSelection";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import SetPassword from "./pages/SetPassword";
import LoginVerify from "./pages/LoginVerify";
import ForgotPassword from "./pages/ForgotPassword";
import Translation from "./pages/Translation";
import Grammar from "./pages/Grammar";
import Summarize from "./pages/Summarize";
import TextGenerator from "./pages/TextGenerator";
import Mainchat from "./pages/chat-pages/Mainchat";

function App() {
  return (
    <Routes>
      {/* صفحه‌ی اصلی سایت → فرم جدید ثبت‌نام */}
      <Route path="/" element={<Signup />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* مسیرهای موقتاً غیرفعال */}
      {/* 
      <Route path="/login-verify" element={<LoginVerify />} />
      <Route path="/verify-phone" element={<VerifyPhone />} />
      <Route path="/verify-code" element={<VerifyCode />} />
      */}

      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/theme-selection" element={<ThemeSelection />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/set-password" element={<SetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/translation" element={<Translation />} />
      <Route path="/grammar" element={<Grammar />} />
      <Route path="/summarize" element={<Summarize />} />
      <Route path="/text-generator" element={<TextGenerator />} />
      <Route path="/mainchat" element={<Mainchat />} />
    </Routes>
  );
}

export default App;