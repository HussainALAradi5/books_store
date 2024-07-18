const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    password_digest: { type: String, required: true },
    email: { type: String, required: true },
    receipts: [{ type: Schema.Types.ObjectId, ref: "Receipt" }],
    isActive: { type: Boolean, default: true },
    admin: { type: Boolean, default: false },
    books: [{ type: Schema.Types.ObjectId, ref: "Book" }],
  },
  {
    timestamps: true,
  }
);

const user = mongoose.model("User", userSchema);

module.exports = user;
