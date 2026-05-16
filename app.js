// Load .env from root first (cPanel places it here), then server/ as fallback
require('dotenv').config();
require('dotenv').config({ path: require('path').join(__dirname, 'server', '.env') });
process.env.TZ = 'Asia/Karachi';
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const errorHandler = require('./server/middleware/errorHandler');

// Route imports
const authRoutes = require('./server/routes/authRoutes');
const bookingRoutes = require('./server/routes/bookingRoutes');
const workerRoutes = require('./server/routes/workerRoutes');
const adminRoutes = require('./server/routes/adminRoutes');
const notificationRoutes = require('./server/routes/notificationRoutes');
const contactRoutes = require('./server/routes/contactRoutes');

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('✅ MongoDB Connected');
    // Start scheduler only after DB is ready
    const { startChatEmailScheduler } = require('./server/utils/chatEmailScheduler');
    startChatEmailScheduler();
  })
  .catch(err => { console.error('❌ MongoDB error:', err.message); process.exit(1); });

const app = express();

// Auto Deployment Webhook
app.post('/api/deploy', express.raw({ type: '*/*' }), (req, res) => {
  const secret    = process.env.DEPLOY_SECRET;
  const signature = req.headers['x-hub-signature-256'];

  // If a secret is configured, verify GitHub's HMAC-SHA256 signature
  if (secret) {
    if (!signature) {
      return res.status(401).json({ message: 'Missing signature header' });
    }
    const crypto   = require('crypto');
    const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(req.body).digest('hex');
    try {
      if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
        return res.status(401).json({ message: 'Invalid signature' });
      }
    } catch {
      return res.status(401).json({ message: 'Signature mismatch' });
    }
  }

  res.status(200).json({ message: 'Deployment triggered' });

  console.log('🔄 Deployment triggered by GitHub...');
  require('child_process').exec('bash deploy.sh', (error) => {
    if (error) { console.error('❌ Deployment error:', error.message); return; }
    console.log('✅ Deployment successful!');
  });
});

// Core Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for mobile compatibility
}));
app.use(cors({
  origin: [
    'https://serviceknock.com',
    'http://localhost',
    'http://localhost:5173',
    'http://localhost:5000',
    'capacitor://localhost',  // Capacitor http scheme
    'https://localhost',      // Capacitor https scheme (androidScheme: "https")
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
