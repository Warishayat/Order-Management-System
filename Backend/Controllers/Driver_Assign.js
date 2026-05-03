const Order = require("../Models/Order");

const assignDriver = async (req, res) => {
  try {
    const { name, phone } = req.body;
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Driver name and phone are required"
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    order.driver = {
      name,
      phone,
      assignedAt: new Date()
    };

    await order.save();

    res.json({
      success: true,
      message: "Driver assigned successfully",
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { assignDriver };