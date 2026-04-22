const Message = require("../Models/message");
const User = require("../Models/User");

const getSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: "seller", isApproved: true }).select("-password");
    res.status(200).json({ sellers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    let receiverId = req.params.userId;
    
    if (req.user.role === "seller" && !receiverId) {
      const admin = await User.findOne({ role: "admin" });
      if (!admin) return res.status(404).json({ message: "Admin not found" });
      receiverId = admin._id;
    }

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: receiverId },
        { sender: receiverId, receiver: req.user._id },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    let receiverId = req.params.userId;
    const { message } = req.body;

    if (!message) return res.status(400).json({ message: "Message is required" });

    if (req.user.role === "seller" && !receiverId) {
      const admin = await User.findOne({ role: "admin" });
      if (!admin) return res.status(404).json({ message: "Admin not found" });
      receiverId = admin._id;
    }

    const newMessage = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      message,
    });

    res.status(201).json({ message: "Message sent", newMessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSellers, getMessages, sendMessage };
