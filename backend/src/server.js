require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB, getIsConnected, getCurrentDbName } = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const placementRoutes = require('./routes/placementRoutes');
const jobRoutes = require('./routes/jobRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const isDbConnected = getIsConnected();
  if (isDbConnected) {
    return res.status(200).json({
      success: true,
      server: 'running',
      database: 'connected',
      databaseName: getCurrentDbName(),
      timestamp: new Date().toISOString(),
    });
  }
  return res.status(503).json({
    success: false,
    server: 'running',
    database: 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/placement', placementRoutes);
app.use('/api/jobs', jobRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Connect DB & Start Server
const startServer = async () => {
  console.log('====================================');
  console.log('CareerLens Backend Engine');
  
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`Server: Running on port ${PORT}`);
    console.log(`API Base: http://localhost:${PORT}/api`);
    console.log('====================================');
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${PORT} is already in use by an active CareerLens backend instance.`);
    } else {
      console.error('Server error:', err.message);
    }
  });
};

startServer();
