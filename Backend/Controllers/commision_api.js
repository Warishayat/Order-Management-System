const Commission = require("../Models/Commission");
const addCommission = async (req, res) => {
  try {
    const { sellerId, amount, week, note } = req.body;
    if (!sellerId || !amount || !week) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const commission = await Commission.create({
      seller: sellerId,
      amount,
      week,
      note,
    });
    res.status(201).json({
      message: "Commission added",
      commission,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { addCommission };