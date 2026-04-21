const Order = require("../Models/Order");
const uploadImage = require("../Middlewares/upload");

const createOrder = async (req, res) => {
  try {
    let imageUrl = "";
    if (req.file) {
      imageUrl = await uploadImage(req.file);
    }

    const order = await Order.create({
      seller: req.user._id,
      customerName: req.body.customerName,
      phone: req.body.phone,
      address: req.body.address,
      productName: req.body.productName,
      quantity: req.body.quantity,
      price: req.body.price,
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