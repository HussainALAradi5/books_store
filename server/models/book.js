const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publishYear: { type: Number, required: true },
  quantity: { type: Number, required: true },
  exist: { type: Boolean, default: false },
  price: { type: Number, default: 0.0 },
  description: { type: String, required: true },
});

const book = mongoose.model("Book", bookSchema);

module.exports = book;
