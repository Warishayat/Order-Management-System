const {Schema,model} = require("mongoose");
const commissionSchema = new Schema(
  {
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    week: {
      type: String, 
      required: true,
    },
    note: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = model("Commission", commissionSchema);