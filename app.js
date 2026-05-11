require('dotenv').config();
process.env.TZ = 'Asia/Karachi';
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./server/config/db');
const errorHandler = require('./server/middleware/errorHandler');

// Route imports
const authRoutes = require('./server/routes/authRoutes');
const bookingRoutes = require('./server/routes/bookingRoutes');
const workerRoutes = require('./server/routes/workerRoutes');
const adminRoutes = require('./server/routes/adminRoutes');
const notificationRoutes = require('./server/routes/notificationRoutes');
const contactRoutes = require('./server/routes/contactRoutes');

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Auto Deployment Webhook
app.all('/api/deploy', (req, res) => {
  const secret = process.env.DEPLOY_SECRET;
  const githubSecret = req.headers['x-hub-signature-256'];

  if (!githubSecret || !secret) {
    return res.status(401).json({ message: 'No secret provided' });
  }

  const { exec } = require('child_process');
  res.status(200).json({ message: 'Deployment triggered' });

  console.log('🔄 Deployment triggered by GitHub...');
  
  exec('bash deploy.sh', (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Deployment Error: ${error}`);
      return;
    }
    console.log('✅ Deployment successful!');
  });
});

// Core Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for mobile compatibility
}));
app.use(cors({
  origin: [
    'https://serviceknock.com.irfanrashid.net',
    'http://localhost',
    'http://localhost:5173',
    'capacitor://localhost',
    'http://localhost:5000'
  ],
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Service Knock API is running 🚀' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/chat', require('./server/routes/chatRoutes'));

// Serve Static Files (for production)
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// Handle React routing, return all requests to React app
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler for API
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Service Knock Server running on port ${PORT}`);
});
