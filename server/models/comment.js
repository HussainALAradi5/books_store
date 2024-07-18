const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const commentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "Book" },
  comment: String,
});
const comment = mongoose.model("Comment", commentSchema);
module.exports = comment;
