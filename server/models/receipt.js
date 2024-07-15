const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const receiptSchema = new Schema({
  username: { type: String, required: true },
  bookDetails: [{ type: Schema.Types.ObjectId, ref: "Book" }],
  numberOfBooks: { type: Number, required: true },
});

const receipt = mongoose.model("Receipt", receiptSchema);

module.exports = receipt;
