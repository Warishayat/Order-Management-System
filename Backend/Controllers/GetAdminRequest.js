const seller_request = require("../Models/Seller_request");
const GetAllRequest = async(req,res)=>{
    try {
        const requests = await seller_request.find();
        res.status(200).json({ requests });   
    }catch(error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports = {GetAllRequest};