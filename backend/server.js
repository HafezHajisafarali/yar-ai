import dotenv from 'dotenv';
dotenv.config();

// Debug logging
console.log("Environment variables loaded:");
console.log("OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY);
console.log("OPENAI_API_KEY length:", process.env.OPENAI_API_KEY?.length);
console.log("PORT:", process.env.PORT);
console.log("NODE_ENV:", process.env.NODE_ENV);

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

console.log("🔍 JWT_SECRET:", process.env.JWT_SECRET);

import toolsRoutes from './routes/toolsRoutes.js';
import passport from './config/passport.js';
import session from 'express-session';
import authRoutes from './routes/authRoutes.js';

console.log("🚀 Starting YAR backend server...");
console.log("🔧 Environment:", process.env.NODE_ENV || 'not set');

const app = express();
const PORT = process.env.PORT || 5050;
const MONGO_URI = process.env.MONGO_URI;

// Debug express app setup
console.log("🔧 Setting up middleware...");

// Middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Add Vite's default port
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
console.log("✅ CORS middleware added");

app.use(express.json());
console.log("✅ JSON middleware added");

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'mySecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
};
app.use(session(sessionConfig));
console.log("✅ Session middleware added");

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());
console.log("✅ Passport middleware added");

// Health check
app.get('/ping', (req, res) => {
  res.send('✅ YAR backend is alive and running!');
});
console.log("✅ Health check route added");

// Routes
console.log("🔧 Setting up routes...");
app.use('/api/tools', toolsRoutes);
console.log("✅ Tools routes added");

app.use('/api/auth', authRoutes);
console.log("✅ Auth routes added");

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Express error:', err);
  res.status(500).json({ message: 'خطای سرور داخلی.' });
});
console.log("✅ Error handling middleware added");

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error('❌ MONGO_URI is not defined in .env file');
    }
    
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000 // تا سریع‌تر خطا بده
    });
    console.log('✅ Connected to MongoDB');

    // Try ports 5050, 5051, 5052 in sequence
    const tryPort = async (port) => {
      try {
        await new Promise((resolve, reject) => {
          const server = app.listen(port)
            .once('listening', () => {
              console.log(`🚀 Server is running at: http://localhost:${port}`);
              resolve();
            })
            .once('error', (err) => {
              if (err.code === 'EADDRINUSE') {
                console.log(`Port ${port} is in use, trying next port...`);
                server.close();
                reject(err);
              } else {
                reject(err);
              }
            });
        });
      } catch (err) {
        if (err.code === 'EADDRINUSE' && port < 5052) {
          return tryPort(port + 1);
        }
        throw err;
      }
    };

    await tryPort(PORT);
  } catch (err) {
    console.log('📛 Full error:', err);
    console.error('❌ Failed to start server:\n', err.message);
    process.exit(1);
  }
};

console.log("🔄 Starting server...");
startServer();