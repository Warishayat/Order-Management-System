const express = require('express');
const admin_router = express.Router();

const {protect} = require("../Middlewares/authMiddleware");
const {adminOnly} = require("../Middlewares/CheckAdmin");
const {getAllOrders,updateOrderStatus} = require("../Controllers/get_order_api");
const {deleteOrder} = require('../Controllers/delete_order_api');
const { getAdminDashboard} = require("../Controllers/admin_dashboard");
const { getSellers, getMessages, sendMessage } = require("../Controllers/message_api");


admin_router.get("/orders",protect,adminOnly,getAllOrders);
admin_router.put("/order/:id/status",protect,adminOnly,updateOrderStatus);
admin_router.delete("/order/:id", protect, adminOnly, deleteOrder);
admin_router.get("/dashboard", protect, adminOnly, getAdminDashboard);
admin_router.get("/sellers", protect, adminOnly, getSellers);
admin_router.get("/messages/:userId", protect, adminOnly, getMessages);
admin_router.post("/messages/:userId", protect, adminOnly, sendMessage);

module.exports = admin_router;