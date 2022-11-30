const mongoose = require('mongoose');
const database = require('../../database/index')

const profileSchema = new mongoose.Schema({
  username: String,
  headline: String,
  email: String,
  zipcode: String,
  dob: String,
  avatar: String,
  following: []
})

// module.exports = userSchema;
module.exports = mongoose.model('profile', profileSchema);