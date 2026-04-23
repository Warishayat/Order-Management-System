const Commission = require("../Models/Commission");
const getMyCommission = async (req, res) => {
  try {
    const commissions = await Commission.find({
      seller: req.user._id
    })
      .sort({ createdAt: -1 }); 
    const total = commissions.reduce((sum, c) => sum + c.amount, 0);
    res.status(200).json({
      totalCommission: total,
      commissions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { getMyCommission };