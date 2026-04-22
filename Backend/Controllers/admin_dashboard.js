const Order = require("../Models/Order");
const SellerRequest = require("../Models/Seller_request");

const getAdminDashboard = async (req, res) => {
  try {
    const orders = await Order.find();
    const requests = await SellerRequest.find({ status: "pending" });

    const totalOrders = orders.length;
    const pendingRequests = requests.length;
    
    const confirmedOrders = orders.filter(o => o.status === "confirmed");
    const totalRevenue = confirmedOrders.reduce((sum, order) => sum + (order.price || 0), 0);

    res.status(200).json({
      totalOrders,
      totalRevenue,
      pendingRequests
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAdminDashboard };