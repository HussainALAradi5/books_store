const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true },
  poster: String,
  author: { type: String, required: true },
  publishYear: { type: Number, required: true },
  price: { type: Number, default: 0.0 },
  description: { type: String, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

const book = mongoose.model("Book", bookSchema);

module.exports = book;
