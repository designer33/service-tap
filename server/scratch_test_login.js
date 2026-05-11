const http = require('http');

// Test 1: Login with phone number
const testWithPhone = () => {
  const data = JSON.stringify({ email: '03009169821', password: '123456' });
  const options = { hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': data.length } };
  
  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      try { 
        const parsed = JSON.parse(body);
        console.log('Phone Login - Status:', res.statusCode);
        console.log('Phone Login - Message:', parsed.message || 'SUCCESS - token received');
      } catch(e) { console.log('Phone Login - Status:', res.statusCode, '- Raw:', body.substring(0, 100)); }
    });
  });
  req.on('error', (e) => console.error('Phone Login Error:', e.message));
  req.write(data); req.end();
};

// Test 2: Login with email
const testWithEmail = () => {
  const data = JSON.stringify({ email: 'neelikhan33@gmail.com', password: '123456' });
  const options = { hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': data.length } };
  
  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        console.log('Email Login - Status:', res.statusCode);
        console.log('Email Login - Message:', parsed.message || 'SUCCESS - token received');
      } catch(e) { console.log('Email Login - Status:', res.statusCode, '- Raw:', body.substring(0, 100)); }
    });
  });
  req.on('error', (e) => console.error('Email Login Error:', e.message));
  req.write(data); req.end();
};

// Run both tests
testWithEmail();
setTimeout(testWithPhone, 500);
