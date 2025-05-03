import express from 'express';
import passport from '../config/passport.js';
import User from '../models/User.js';
import { registerUser, googleAuth, updateUserProfile, changePassword, loginUser, registerPhone, verifyPhoneCode, resetUsers } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();
console.log("✅ User model loaded:", typeof User);

// Debug routes
console.log("🔍 Setting up auth routes...");

router.post('/login', loginUser);
console.log("✅ POST /login route added");

router.post('/verify-phone', verifyPhoneCode);
console.log("✅ POST /verify-phone route added");

router.get('/me', verifyToken, (req, res) => {
  res.json({
    message: 'این اطلاعات محافظت‌شده است.',
    user: req.user,
  });
});
console.log("✅ GET /me route added");

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));
console.log("✅ GET /google route added");

// Fix the Google callback route
router.get(
  '/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect to dashboard
    res.redirect('/dashboard');
  }
);
console.log("✅ GET /google/callback route added");

router.post('/register', registerUser);
console.log("✅ POST /register route added");

router.post('/register-phone', registerPhone);
console.log("✅ POST /register-phone route added");

router.put('/profile', verifyToken, updateUserProfile);
console.log("✅ PUT /profile route added");

router.post('/change-password', verifyToken, changePassword);
console.log("✅ POST /change-password route added");

// افزودن مسیر جدید برای بازنشانی کاربران (فقط در محیط توسعه)
router.post('/reset-users', resetUsers);
console.log("✅ POST /reset-users route added");

router.post('/google', googleAuth);
console.log("✅ POST /google route added");

console.log("✅ All auth routes set up!");

export default router;