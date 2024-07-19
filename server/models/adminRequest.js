const mongoose = require("mongoose");

const adminRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    dataOfRequest: { type: Date, default: Date.now },
    dateOfResponse: Date,
    adminName: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AdminRequest", adminRequestSchema);
