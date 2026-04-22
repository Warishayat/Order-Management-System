const mongoose = require('mongoose');
const Order = require('./Models/Order');
const SellerRequest = require('./Models/Seller_request');
require('dotenv').config();

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const requests = await SellerRequest.find({ status: "pending" });
  console.log("Pending requests count:", requests.length);
  
  const allRequests = await SellerRequest.find();
  console.log("All requests:", allRequests);
  
  process.exit(0);
}

test();
