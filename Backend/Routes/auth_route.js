const express = require('express');
const auth_router = express.Router();

const {SellerRequestForm} = require("../Controllers/Seller_request");
const {GetAllRequest} = require("../Controllers/GetAdminRequest");
const {ApproveSellerRequest} = require("../Controllers/Approve_Api");
const {rejectSeller} = require("../Controllers/Reject_Api");
const {loginUser} = require("../Controllers/Login_Api");
const {adminOnly} = require("../Middlewares/CheckAdmin")
const {protect} = require("../Middlewares/authMiddleware")

auth_router.post("/seller-request",SellerRequestForm);
auth_router.get("/admin/requests",protect,adminOnly,GetAllRequest);
auth_router.post("/admin/approve/:id",protect,adminOnly,ApproveSellerRequest);
auth_router.post("/admin/reject/:id",protect,adminOnly,rejectSeller);
auth_router.post("/login",loginUser);

module.exports = auth_router;