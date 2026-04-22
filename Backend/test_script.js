const axios = require('axios');

async function test() {
  try {
    // 1. Log in as admin (we need to know admin credentials, but let's assume they exist or we'll get a 401)
    // Wait, I can't know the password. Let's just create a test request and see if we can get it without auth, or we can't because it's protected.
    
    // Instead, let's create a seller request
    console.log("Creating seller request...");
    const res = await axios.post('http://localhost:8000/auth/seller-request', {
      name: "Test Seller",
      email: "test.seller." + Date.now() + "@example.com",
      password: "password123"
    });
    console.log("Create response:", res.data);
    
  } catch (e) {
    console.error("Error:", e.response ? e.response.data : e.message);
  }
}

test();
