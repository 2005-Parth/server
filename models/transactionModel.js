const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    grpId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: [true, "Group ID is required"],
    },
    payerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Payee ID is required"],
    },
    users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: [true, "Users are required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    description: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);