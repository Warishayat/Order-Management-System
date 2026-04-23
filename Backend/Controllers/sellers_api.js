const User = require("../Models/User");
const getAllSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: "seller" })
      .select("_id name email")   
      .sort({ createdAt: -1 });
    res.status(200).json({
      count: sellers.length,
      sellers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { getAllSellers };