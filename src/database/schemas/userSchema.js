const mongoose = require('mongoose');
const database = require('../../database/index')

const userSchema = new mongoose.Schema({
  username: String,
  salt: String,
  hash: String
})

// module.exports = userSchema;
module.exports = mongoose.model('user', userSchema);