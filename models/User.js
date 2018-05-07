const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telephone: { type: String, unique: true },
  sessionId: { type: String },
  first_name: { type: String },
  last_name: { type: String },
  gender: { type: String },
  user_type: { type: String },
  state: { type: String }

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
