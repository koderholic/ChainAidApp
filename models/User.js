const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  taxid: { type: String, unique: true },
  companyname: { type: String },
  rcnumber: { type: String },
  mainaddress: { type: String },
  telephoneno1: { type: String },
  telephoneno2: { type: String },
  email: { type: String },
  website: { type: String },
  natureofbusiness: { type: String },
  othernatureofbusiness: { type: String }

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
