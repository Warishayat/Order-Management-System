const Order=require("../Models/Order")

const getAdminDashboard = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("seller", "name email")
      .sort({ createdAt: -1 });

    const total = orders.length;
    const pending = orders.filter(o => o.status === "pending").length;
    const confirmed = orders.filter(o => o.status === "confirmed").length;
    const cancelled = orders.filter(o => o.status === "cancelled").length;

    res.status(200).json({
      stats: {
        total,
        pending,
        confirmed,
        cancelled,
      },
      orders
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {getAdminDashboard}