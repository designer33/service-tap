require('dotenv').config();
process.env.TZ = 'Asia/Karachi';
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const workerRoutes = require('./routes/workerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('✅ MongoDB Connected');
    const { startChatEmailScheduler } = require('./utils/chatEmailScheduler');
    startChatEmailScheduler();
  })
  .catch(err => { console.error('❌ MongoDB error:', err.message); process.exit(1); });

const app = express();

// Auto Deployment Webhook
app.post('/api/deploy', express.raw({ type: '*/*' }), (req, res) => {
  const secret    = process.env.DEPLOY_SECRET;
  const signature = req.headers['x-hub-signature-256'];

  if (secret) {
    if (!signature) return res.status(401).json({ message: 'Missing signature header' });
    const crypto   = require('crypto');
    const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(req.body).digest('hex');
    try {
      if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected)))
        return res.status(401).json({ message: 'Invalid signature' });
    } catch { return res.status(401).json({ message: 'Signature mismatch' }); }
  }

  res.status(200).json({ message: 'Deployment triggered' });
  console.log('🔄 Deployment triggered by GitHub...');
  const deployScript = require('path').join(__dirname, '..', 'deploy.sh');
  require('child_process').exec(`bash "${deployScript}"`, (error) => {
    if (error) { console.error('❌ Deployment error:', error.message); return; }
    console.log('✅ Deployment successful!');
  });
});

// Core Middleware
app.use(helmet({
  contentSecurityPolicy: false, // required for mobile/WebView compatibility
}));
app.use(cors({
  origin: [
    'https://serviceknock.com',
    'http://localhost',
    'http://localhost:5173',
    'http://localhost:5000',
    'capacitor://localhost',
    'https://localhost',
  ],
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.5', message: 'Service Knock API is running 🚀' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/chat', require('./routes/chatRoutes'));

// Serve Static Files (for production)
const path = require('path');
app.use(express.static(path.join(__dirname, '..', 'public')));

// Handle React routing, return all requests to React app
app.get('*', (req, res, next) => {
  // If the request starts with /api, it should have been caught by the routes above
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// 404 handler for API
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Service Knock Server running on port ${PORT}`);
});
