const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required:true
    },
    customerName: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    description:{
      type:String,
      required:false,
      trim:true
    },
    quantity: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    price: {
      type: Number,
    },
    image: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    isCompanyOrder: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Order", OrderSchema);