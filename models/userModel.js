const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true
    },
    firebaseId: {
      type: String,
      required: [true, "Firebase ID is required"],
      unique: true
    },
    groups: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Group",
    },
    account:{
      type: [{
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        amount: {
          type: Number,
        }
      }]
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
