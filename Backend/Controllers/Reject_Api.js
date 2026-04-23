const User = require("../Models/User");
const SellerRequest = require("../Models/Seller_request");
const rejectSeller = async (req, res) => {
  try {
    const request = await SellerRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }
    await SellerRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Request rejected successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {rejectSeller}