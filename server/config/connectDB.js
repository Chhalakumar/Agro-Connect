const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Cache connection for serverless
let cachedDb = null;

async function connectDB() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log('Using cached MongoDB connection');
    return cachedDb;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 2, // Maintain at least 2 socket connections
    });
    
    cachedDb = db;
    console.log('Connected to MongoDB');
    return db;
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err;
  }
}

// For backward compatibility with existing code
connectDB().catch(err => {
  console.error('Initial MongoDB connection failed:', err);
});

module.exports = connectDB;
