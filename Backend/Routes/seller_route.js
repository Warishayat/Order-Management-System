const express = require("express");
const seller_router = express.Router();

const { createOrder } = require("../Controllers/order_api");
const { protect } = require("../Middlewares/authMiddleware");
const {getMyOrders} = require("../Controllers/seller_order_api")
const upload = require("../Middlewares/upload");
const {deleteOrder} = require("../Controllers/delete_order_api");
const { getSellerDashboard } = require("../Controllers/seller_dashboard");

seller_router.post("/create-order", protect, upload.single("image"), createOrder);
seller_router.get("/my-orders",protect,getMyOrders);
seller_router.delete("/order/:id", protect, deleteOrder);
seller_router.get("/dashboard", protect, getSellerDashboard);

module.exports = seller_router;