import dotenv from 'dotenv';
dotenv.config();

// ✅ Debug .env variables
console.log("Environment variables loaded:");
console.log("OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY);
console.log("PORT:", process.env.PORT);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("🔐 JWT_SECRET:", process.env.JWT_SECRET);

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from './config/passport.js';
import session from 'express-session';
import toolsRoutes from './routes/toolsRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = parseInt(process.env.PORT) || 5050;
const MONGO_URI = process.env.MONGO_URI;

console.log("🔧 Setting up middlewares...");

// ✅ CORS middleware (اجازه به همه originها - مخصوص تست و دیپلوی موقت)
app.use(cors({
  origin: (origin, callback) => {
    console.log('🌐 Request Origin:', origin);
    callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
console.log("✅ CORS middleware applied");

app.use(express.json());
console.log("✅ JSON middleware applied");

// ✅ Log all incoming requests
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// ✅ Session config
app.use(session({
  secret: process.env.SESSION_SECRET || 'mySecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
}));
console.log("✅ Session middleware applied");

// ✅ Initialize passport
app.use(passport.initialize());
app.use(passport.session());
console.log("✅ Passport initialized");

// ✅ Health check route
app.get('/ping', (req, res) => {
  res.send('✅ YAR backend is alive and running!');
});

// ✅ API routes
app.use('/api/tools', toolsRoutes);
app.use('/api/auth', authRoutes);
console.log("✅ Routes loaded");

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ message: 'خطای سرور داخلی.' });
});

// ✅ MongoDB connection & server startup
const startServer = async () => {
  try {
    if (!MONGO_URI) throw new Error('❌ MONGO_URI is not defined');

    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 3000 });
    console.log("✅ MongoDB connected");

    // Try ports: 5050 → 5051 → 5052
    const tryPort = async (port) => {
      return new Promise((resolve, reject) => {
        const server = app.listen(port, '0.0.0.0')
          .once('listening', () => {
            console.log(`🚀 Server running at: http://localhost:${port}`);
            resolve();
          })
          .once('error', (err) => {
            if (err.code === 'EADDRINUSE') {
              console.log(`⚠️ Port ${port} in use, trying next...`);
              server.close();
              reject(err);
            } else {
              reject(err);
            }
          });
      }).catch(err => {
        if (port < 5052) return tryPort(port + 1);
        throw err;
      });
    };

    await tryPort(PORT);
  } catch (err) {
    console.error('❌ Server failed to start:\n', err);
    process.exit(1);
  }
};

console.log("🚀 Booting YAR backend server...");
startServer();