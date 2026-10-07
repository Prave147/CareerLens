const mongoose = require('mongoose');

// Disable command buffering so queries fail immediately when disconnected
mongoose.set('bufferCommands', false);

let isConnected = false;
let currentHost = '';
let currentDbName = 'careerLens';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  console.log('MongoDB connecting...');

  if (!uri) {
    console.error('MongoDB Atlas connection failed: MONGODB_URI is not defined in .env');
    isConnected = false;
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: 'careerLens',
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    isConnected = true;
    currentHost = conn.connection.host;
    currentDbName = conn.connection.name || 'careerLens';
    console.log('MongoDB Atlas connected successfully');
    console.log(`Database: ${currentDbName}`);
    return true;
  } catch (error) {
    isConnected = false;
    let safeMessage = error.message;
    if (
      safeMessage.includes('IP') ||
      safeMessage.includes('whitelist') ||
      safeMessage.includes('servers in your MongoDB Atlas cluster')
    ) {
      safeMessage = 'Could not reach MongoDB Atlas cluster. Please ensure your IP address is whitelisted in Atlas Network Access (or allow 0.0.0.0/0).';
    } else if (safeMessage.includes('bad auth') || safeMessage.includes('Authentication failed')) {
      safeMessage = 'Authentication failed. Please verify database username and password in MONGODB_URI.';
    }
    console.error(`MongoDB Atlas connection failed: ${safeMessage}`);
    return false;
  }
};

const getIsConnected = () => {
  return isConnected && mongoose.connection && mongoose.connection.readyState === 1;
};

const getCurrentHost = () => currentHost;
const getCurrentDbName = () => currentDbName;

module.exports = { connectDB, getIsConnected, getCurrentHost, getCurrentDbName };

