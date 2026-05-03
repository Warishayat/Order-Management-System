const express = require('express');
const admin_router = express.Router();
const {protect} = require("../Middlewares/authMiddleware");
const {adminOnly} = require("../Middlewares/CheckAdmin");
const {getAllOrders,updateOrderStatus} = require("../Controllers/get_order_api");
const {deleteOrder} = require('../Controllers/delete_order_api');
const { getAdminDashboard} = require("../Controllers/admin_dashboard");
const { getSellers, getMessages, sendMessage } = require("../Controllers/message_api");
const { createOrder } = require("../Controllers/order_api");
const { updateOrder } = require("../Controllers/updateOrder_api");
const { addCommission } = require("../Controllers/commision_api");
const upload = require("../Middlewares/upload");
const {getAllSellers} = require("../Controllers/sellers_api");
const {getSingleOrder} = require("../Controllers/open_order_api");
admin_router.get("/orders",protect,adminOnly,getAllOrders);
const {Order_by_date} = require("../Controllers/Order_by_date");
const {assignDriver} = require("../Controllers/Driver_Assign");




admin_router.put("/order/:id/status",protect,adminOnly,updateOrderStatus);
admin_router.delete("/order/:id", protect, adminOnly, deleteOrder);
admin_router.get("/dashboard", protect, adminOnly, getAdminDashboard);
admin_router.get("/sellers", protect, adminOnly, getSellers);
admin_router.get("/messages/:userId", protect, adminOnly, getMessages);
admin_router.post("/messages/:userId", protect, adminOnly, sendMessage);
admin_router.post("/create-order", protect,adminOnly, upload.single("image"), createOrder);
admin_router.put("/edit-order/:id", protect,adminOnly, upload.single("image"), updateOrder);
admin_router.post("/add-commission", protect,adminOnly, addCommission);
admin_router.get("/all-sellers", protect, adminOnly, getAllSellers);
admin_router.get("/order/:id", protect, adminOnly, getSingleOrder);
admin_router.get("/orders-by-date",protect,adminOnly,Order_by_date);
admin_router.post("/order/:id/assign-driver",protect,adminOnly,assignDriver);


module.exports = admin_router;