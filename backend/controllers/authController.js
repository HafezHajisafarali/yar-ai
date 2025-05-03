import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Store verification codes in memory (in production, use Redis or similar)
const verificationCodes = new Map();

export const registerUser = async (req, res) => {
  try {
    const { name } = req.body;
    console.log("🧪 raw req.body:", req.body);
    console.log("🧪 Parsed name:", name);

    if (!name) {
      console.warn("⚠️ No name received in req.body");
      return res.status(400).json({ message: "نام الزامی است." });
    }
    if (!req.body.email) {
      return res.status(400).json({ message: "ایمیل الزامی است." });
    }
    
    // Prevent duplicate user only by email or phone (not name)
    const existingUser = await User.findOne({ email: req.body.email }).lean();

    // Only include non-null/undefined fields
    const userData = {};
    if (name) userData.name = name;
    if (req.body.email) userData.email = req.body.email;
    const newUser = new User(userData);

    try {
      await newUser.save();
      console.log("✅ User saved successfully");
      return res.status(201).json({ message: "ثبت‌نام با موفقیت انجام شد." });
    } catch (saveError) {
      // بررسی خطای duplicate key
      if (saveError.code === 11000) {
        console.error("❌ Duplicate key error:", saveError);
        return res.status(400).json({ message: "کاربری با اطلاعات وارد شده قبلاً ثبت‌نام کرده است." });
      }
      
      console.error("❌ Error saving user:", saveError);
      return res.status(500).json({ message: "خطا در ذخیره‌سازی کاربر.", error: saveError.message });
    }

  } catch (err) {
    console.error("❌ Error in registerUser:", err);
    res.status(500).json({ message: "خطای سرور." });
  }
};

export const registerPhone = async (req, res) => {
  const { email, phone } = req.body;
  console.log("📞 Phone:", phone, "📧 Email:", email);

  if (!email || !phone) {
    return res.status(400).json({ message: 'ایمیل و شماره تلفن الزامی است.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'کاربری با این ایمیل یافت نشد.' });
    }

    user.phone = phone;
    await user.save();

    res.status(200).json({ message: 'شماره تلفن ذخیره شد.' });
  } catch (err) {
    console.error('❌ Error in registerPhone:', err);
    res.status(500).json({ message: 'خطا در ذخیره شماره تلفن.' });
  }
};

// Updated to handle phone login
export const loginUser = async (req, res) => {
  try {
    // Check if this is a phone login request
    if (req.body.phone) {
      const { phone } = req.body;
      
      // Validate phone number format
      if (!phone || !/^09[0-9]{9}$/.test(phone)) {
        return res.status(400).json({ message: 'شماره تلفن نامعتبر است.' });
      }
      
      // Generate a 6-digit code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store the code with the phone number (consider expiration)
      verificationCodes.set(phone, {
        code: verificationCode,
        expiresAt: Date.now() + 120000 // 2 minutes
      });
      
      // In a real application, send the code via SMS
      console.log(`✅ Verification code for ${phone}: ${verificationCode}`);
      
      // Find or create a user with this phone number
      let user = await User.findOne({ phone });
      
      if (!user) {
        // Create a new user with just the phone number
        user = new User({ phone });
        await user.save();
        console.log(`✅ New user created with phone: ${phone}`);
      }
      
      return res.status(200).json({ 
        message: 'کد تایید ارسال شد.',
        // In development only, you might want to include the code in the response
        code: process.env.NODE_ENV === 'development' ? verificationCode : undefined
      });
    }
    
    // Handle traditional email/password login
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'کاربری با این ایمیل یافت نشد.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'رمز عبور اشتباه است.' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({ message: 'ورود موفقیت‌آمیز بود.', token });
  } catch (err) {
    console.error('❌ Error in loginUser:', err);
    res.status(500).json({ message: 'خطا در ورود.' });
  }
};

// New controller for verifying the phone code
export const verifyPhoneCode = async (req, res) => {
  try {
    const { phone, code } = req.body;
    
    if (!phone || !code) {
      return res.status(400).json({ message: 'شماره تلفن و کد تایید الزامی است.' });
    }
    
    // Get the stored verification data
    const verificationData = verificationCodes.get(phone);
    
    if (!verificationData) {
      return res.status(400).json({ message: 'کد تایید منقضی شده است. لطفا دوباره درخواست کنید.' });
    }
    
    if (Date.now() > verificationData.expiresAt) {
      // Clean up expired code
      verificationCodes.delete(phone);
      return res.status(400).json({ message: 'کد تایید منقضی شده است. لطفا دوباره درخواست کنید.' });
    }
    
    if (verificationData.code !== code) {
      return res.status(400).json({ message: 'کد تایید نادرست است.' });
    }
    
    // Code is valid - find the user
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد.' });
    }
    
    // Clean up used code
    verificationCodes.delete(phone);
    
    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    
    res.status(200).json({ 
      message: 'ورود موفقیت‌آمیز بود.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
      } 
    });
  } catch (err) {
    console.error('❌ Error in verifyPhoneCode:', err);
    res.status(500).json({ message: 'خطا در تایید کد.' });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد.' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('❌ Error in getUserProfile:', err);
    res.status(500).json({ message: 'خطا در دریافت اطلاعات کاربر.' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد.' });
    }

    const { name, phone } = req.body;

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    res.status(200).json({ message: 'پروفایل با موفقیت بروزرسانی شد.' });
  } catch (err) {
    console.error('❌ Error in updateUserProfile:', err);
    res.status(500).json({ message: 'خطا در بروزرسانی پروفایل.' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد.' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'هر دو رمز عبور الزامی هستند.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'رمز عبور فعلی اشتباه است.' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: 'رمز عبور با موفقیت تغییر کرد.' });
  } catch (err) {
    console.error('❌ Error in changePassword:', err);
    res.status(500).json({ message: 'خطا در تغییر رمز عبور.' });
  }
};

// افزودن یک تابع جدید برای بازنشانی مجموعه کاربران
export const resetUsers = async (req, res) => {
  try {
    console.log('🔄 Attempting to reset users collection');
    // حذف تمام کاربران موجود
    const result = await User.deleteMany({});
    console.log('✅ All users deleted successfully', result);
    return res.status(200).json({ message: 'تمام کاربران با موفقیت حذف شدند.', count: result.deletedCount });
  } catch (err) {
    console.error('❌ Error resetting users:', err);
    return res.status(500).json({ message: 'خطا در بازنشانی کاربران.', error: err.message });
  }
};


import { jwtDecode } from 'jwt-decode';

export const googleAuth = async (req, res) => {
  try {
    const { credential, isNewUser } = req.body;

    if (!credential) {
      return res.status(400).json({ error: "توکن گوگل ارسال نشده است." });
    }

    const decoded = jwtDecode(credential);
    console.log("🧪 Decoded Google token:", decoded);

    const { email, name, picture } = decoded;

    if (!email || !name) {
      console.warn("⚠️ ایمیل یا نام در توکن نبود:", decoded);
      return res.status(400).json({ error: "ایمیل یا نام در توکن یافت نشد." });
    }

    let user = await User.findOne({ email });

    if (!user && isNewUser) {
      user = new User({ email, name });
      try {
        await user.save();
        console.log("✅ User saved to MongoDB:", user);
      } catch (saveErr) {
        console.error("❌ Failed to save Google user:", saveErr);
        return res.status(500).json({ error: "ذخیره کاربر در پایگاه‌داده ناموفق بود." });
      }
    }

    if (!user) {
      console.warn("⚠️ User not found and isNewUser is false:", email);
      return res.status(404).json({ error: "کاربری با این ایمیل پیدا نشد." });
    }

    console.log("🔑 JWT_SECRET:", process.env.JWT_SECRET);
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "yarSuperSecretToken123", {
      expiresIn: '7d',
    });

    res.status(200).json({ 
      message: "ورود با گوگل موفق بود",
      token,
      email: user.email,
      name: user.name,
      picture: picture || null
    });
  } catch (err) {
    console.error("❌ Google auth error:", err);
    res.status(400).json({ error: "ورود با گوگل ناموفق بود" });
  }
};