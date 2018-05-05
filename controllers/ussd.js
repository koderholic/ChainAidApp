const { promisify } = require('util');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const randomBytesAsync = promisify(crypto.randomBytes);


exports.postUssd = (req, res, next) => {
  let endSession = false;
  let message = '';
  
  console.log(req.session);
  //const session = req.session.get(params.sessionId);
  //const user = db.getUserByPhone(params.phoneNumber);

  if (req.params.text === '') {
      message = "Welcome to ChainAid \n";
      message += "1: For account info \n";
      message += "2: For lost gas cylinder";

  }
  next({
      response: message, 
      endSession: endSession
  });
}


