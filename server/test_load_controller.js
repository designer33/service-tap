try {
  require('./controllers/authController');
  console.log('authController loaded successfully');
} catch (err) {
  console.error('Error loading authController:', err);
  process.exit(1);
}
