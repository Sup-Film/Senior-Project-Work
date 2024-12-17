const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  user_email: String,
  user_firstname: String,
  user_lastname: String,
  user_password: String,
  user_role: String,
})

module.exports = mongoose.model('Admin', AdminSchema);