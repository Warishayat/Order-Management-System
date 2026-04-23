const mongoose = require("mongoose");
const {Schema,model} = mongoose;
const MessageSchema = new Schema({
    sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  message: String,
}, { timestamps: true });
module.exports = model("Message",MessageSchema);