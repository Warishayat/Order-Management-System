const Order = require("../Models/Order");
const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("seller"); 
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { getSingleOrder };