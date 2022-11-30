const mongoose = require("mongoose");
const database = require("../../database/index");

const commentSchema = new mongoose.Schema({
  commentId: Number,
  name: String,
  text: String,
  img: String
});

// module.exports = userSchema;
module.exports = mongoose.model("comment", commentSchema);
