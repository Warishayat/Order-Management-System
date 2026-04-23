const User = require("../Models/User");
const SellerRequest = require("../Models/Seller_request");
const ApproveSellerRequest = async (req,res)=>{
    try {
    const request = await SellerRequest.findById(req.params.id);
    if(!request){
        res.status(404).json({message:"Request Not Found"})
    }
    const newUser = await User.create({
      name: request.name,
      email: request.email,
      password: request.password,
      role: "seller",
      isApproved: true,
    });
    await SellerRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Seller approved successfully",
      user: newUser,
    });
    } catch(error) {
        res.json(500).json({message:error.message});
    }
}
module.exports = {ApproveSellerRequest}