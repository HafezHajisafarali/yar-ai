// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Debug loaded environment variables
console.log("🔍 GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("🟢 Environment variables loaded:");
console.log("🔑 OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY);
console.log("🌐 PORT:", process.env.PORT);
console.log("🌍 NODE_ENV:", process.env.NODE_ENV);
console.log("🔐 JWT_SECRET:", process.env.JWT_SECRET);

// Dependencies
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import passport from './config/passport.js';
import toolsRoutes from './routes/toolsRoutes.js';
import authRoutes from './routes/authRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Express app & config
const app = express();
const PORT = parseInt(process.env.PORT) || 5050;
const MONGO_URI = process.env.MONGO_URI;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
console.log("⚙️ Setting up middlewares...");

app.use(cors({
  origin: (origin, callback) => {
    console.log('🌐 Request Origin:', origin);
    callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
console.log("✅ CORS applied");

app.use(express.json());
console.log("✅ JSON parser applied");

app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

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

app.use(passport.initialize());
app.use(passport.session());
console.log("✅ Passport initialized");

// API routes
app.get("/ping", (req, res) => {
  res.send("✅ YAR backend is alive and running!");
});
app.use("/api/tools", toolsRoutes);
app.use("/api/auth", authRoutes);
console.log("✅ API routes loaded");
console.log("✅ NODE_ENV:", process.env.NODE_ENV);

// 🔥 Serve frontend build only in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });  
}

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({ message: 'خطای سرور داخلی.' });
});

// MongoDB & Server Start
const startServer = async () => {
  try {
    if (!MONGO_URI) throw new Error("❌ MONGO_URI not defined");

    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 3000 });
    console.log("✅ MongoDB connected");

    const tryPort = async (port) => {
      return new Promise((resolve, reject) => {
        const server = app.listen(port, '0.0.0.0')
          .once('listening', () => {
            console.log(`🚀 Server is running at http://localhost:${port}`);
            resolve();
          })
          .once('error', (err) => {
            if (err.code === 'EADDRINUSE') {
              console.log(`⚠️ Port ${port} in use, trying ${port + 1}...`);
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
    console.error("❌ Failed to start server:\n", err);
    process.exit(1);
  }
};

console.log("🚀 Booting YAR backend server...");
startServer();