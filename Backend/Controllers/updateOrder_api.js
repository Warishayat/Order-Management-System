const Order = require("../Models/Order");
const updateOrder = async (req, res) => {
  try {
    const {
      customerName,
      phone,
      address,
      postcode,
      productName,
      description,
      quantity,
      price,
    } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const isAdmin = req.user.role === "admin";
    if (!isAdmin && order.seller?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (!isAdmin && order.status === "confirmed") {
      return res.status(400).json({
        message: "Cannot edit confirmed order",
      });
    }
    const imageUrl = req.file ? req.file.path : order.image;
    order.customerName = customerName || order.customerName;
    order.phone = phone || order.phone;
    order.address = address || order.address;
    order.postcode = postcode || order.postcode;
    order.productName = productName || order.productName;
    order.description = description || order.description;
    order.quantity = quantity ? Number(quantity) : order.quantity;
    order.price = price ? Number(price) : order.price;
    order.image = imageUrl;
    const updatedOrder = await order.save();
    res.status(200).json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { updateOrder };