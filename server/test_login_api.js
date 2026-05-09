const testLogin = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'irfanrashidkhan@gmail.com',
        password: '123456'
      })
    });
    const data = await res.json();
    console.log('Login Status:', res.status);
    console.log('Data:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
};

testLogin();
