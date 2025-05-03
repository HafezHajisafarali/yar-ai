// Load environment variables first
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 5050;
const MONGO_URI = process.env.MONGO_URI;

// Simple route
app.get('/ping', (req, res) => {
  res.send('✅ Test server is alive and running!');
});

// Connect to MongoDB and start server
async function startServer() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`🚀 Test server is running at: http://localhost:${PORT}`);
      console.log('Try accessing http://localhost:5050/ping in your browser or with curl');
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}

console.log("🔄 Starting test server...");
startServer(); 