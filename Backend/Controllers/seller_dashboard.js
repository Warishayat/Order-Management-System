const Order = require("../Models/Order");

const getSellerDashboard = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user._id })
      .sort({ createdAt: -1 });

    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === "pending").length,
      confirmed: orders.filter(o => o.status === "confirmed").length,
      cancelled: orders.filter(o => o.status === "cancelled").length,
    };

    res.status(200).json({
      stats,
      orders
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSellerDashboard };