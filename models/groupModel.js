const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    description: {
      type: String,
    },
    members: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: [true, "Members are required"],
    },
    joinCode: {
      type: String,
      required: [true, "Join code is required"],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Group", groupSchema);