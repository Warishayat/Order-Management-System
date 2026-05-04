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
    postcode:{
      type:String,
      required:true
    },
    price: {
      type: Number,
    },
    image: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled","delivered"],
      default: "pending",
    },
    isCompanyOrder: {
      type: Boolean,
      default: false,
    },
    driver: {
      name: {
        type: String,
        default: ""
      },
    phone: {
        type: String,
        default: ""
    },
    assignedAt: {
        type: Date,
        default: null
    }
    },
    deliveryNote: {
      type: String,
      default: ""
    },
    deliveryDate: {
    type: Date,
    default: null
  }
  },
  { timestamps: true }
);
module.exports = mongoose.model("Order", OrderSchema);