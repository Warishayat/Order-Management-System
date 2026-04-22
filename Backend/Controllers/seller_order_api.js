const Order = require("../Models/Order");


const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {getMyOrders}