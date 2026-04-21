const {Schema,model} = require('mongoose');

const SellerRequestSchema = new Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:true
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

    }, { timestamps: true }
);

module.exports = model("SellerRequest",SellerRequestSchema);