const Order = require("../Models/Order")

const Order_by_date = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required"
      });
    }

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid date format" });
    }

    const start = new Date(dateObj);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(dateObj);
    end.setUTCHours(23, 59, 59, 999);

    const orders = await Order.find({
      createdAt: {
        $gte: start,
        $lte: end
      }
    }).populate("seller", "name email").sort({ createdAt: -1 });

    res.json({
      success: true,
      totalOrders: orders.length,
      orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = { Order_by_date };