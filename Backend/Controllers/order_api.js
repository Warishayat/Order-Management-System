const Order = require("../Models/Order");
console.log("CREATE ORDER CONTROLLER HIT");
const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      phone,
      address,
      productName,
      quantity,
      price,
    } = req.body;
    if (!customerName || !phone || !address || !productName || !quantity || !price) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    if (isNaN(quantity) || isNaN(price)) {
      return res.status(400).json({
        message: "Quantity and price must be numbers",
      });
    }

    const imageUrl = req.file ? req.file.path : "";

    const order = await Order.create({
      seller: req.user._id,
      customerName,
      phone,
      address,
      productName,
      quantity: Number(quantity),
      price: Number(price),
      image: imageUrl,
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { createOrder };