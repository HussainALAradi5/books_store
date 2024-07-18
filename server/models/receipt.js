const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const receiptSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    books: [{ type: Schema.Types.ObjectId, ref: "Book", required: true }],
    numberOfBooks: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
  },
  {
    timestamps: true,
  }
);

const Receipt = mongoose.model("Receipt", receiptSchema);

module.exports = Receipt;
