const seller_request = require("../Models/Seller_request");


const GetAllRequest = async(req,res)=>{
    try {
        const request = await seller_request.find();
        res.status(200).json({message:request})   
    }catch(error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {GetAllRequest};