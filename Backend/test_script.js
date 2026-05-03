const axios = require('axios');

async function test() {
  try {
  
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
