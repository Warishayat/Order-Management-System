const Order = require("../Models/Order");
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (order.status === "cancelled") {
      return res.status(400).json({ message: "Order already cancelled" });
    }
    order.status = "cancelled";
    await order.save();
    res.status(200).json({
      message: "Order cancelled successfully",
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { cancelOrder };