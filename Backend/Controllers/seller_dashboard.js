const Order = require("../Models/Order");

const getSellerDashboard = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user._id });

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === "pending").length;
    const completedOrders = orders.filter(o => o.status === "confirmed").length;
    
    const confirmedOrders = orders.filter(o => o.status === "confirmed");
    const totalRevenue = confirmedOrders.reduce((sum, order) => sum + (order.price || 0), 0);

    res.status(200).json({
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSellerDashboard };