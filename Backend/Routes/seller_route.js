const express = require("express");
const seller_router = express.Router();

const { createOrder } = require("../Controllers/order_api");
const { protect } = require("../Middlewares/authMiddleware");
const upload = require("../Middlewares/upload");

seller_router.post("/create-order", protect, upload.single("image"), createOrder);

module.exports = seller_router;