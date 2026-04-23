const { protect } = require("../Middlewares/authMiddleware");
const express = require('express');
const profile_router = express.Router();
profile_router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});
module.exports = profile_router;