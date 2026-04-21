const Seller_request = require("../Models/Seller_request");
const User = require("../Models/User");
const bcrypt = require('bcrypt');

const SellerRequestForm = async(req,res)=>{
    try {
        const {name,email,password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }
        const existingRequest = await Seller_request.findOne({email});
        if (existingRequest){
            return res.status(400).json({ message: "User already exists" });
        }
        const hash_password = await bcrypt.hash(password,10);
        await Seller_request.create({
            name,
            email,
            password: hash_password,
        });
        res.status(201).json({
            message: "Request submitted. Wait for admin approval",
        });
    }catch(error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = {SellerRequestForm}