const mongoose = require("mongoose");
const database = require("../../database/index");

const articleSchema = new mongoose.Schema({
  pid: Number,
  author: String,
  text: String,
  date: Date,
  comments: []
});

// module.exports = userSchema;
module.exports = mongoose.model("article", articleSchema);
