const testProfile = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/bookings/profile/irfan-rashid');
    const data = await res.json();
    console.log('Profile Status:', res.status);
    if (res.status !== 200) {
      console.log('Error Data:', JSON.stringify(data, null, 2));
    } else {
      console.log('Profile retrieved successfully');
    }
  } catch (err) {
    console.error('Error:', err);
  }
};

testProfile();
