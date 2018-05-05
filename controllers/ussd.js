const { promisify } = require('util');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const randomBytesAsync = promisify(crypto.randomBytes);
const options = {
    apiKey: '429647716d4133d9f9cdaf5fa0f3ac7248bbfff447dde16443d4c4842f27749a',         // use your sandbox app API key for development in the test environment
    username: 'sandbox',      // use 'sandbox' for development in the test environment
  };
const AfricasTalking = require('africastalking')(options);



exports.postUssd =  new AfricasTalking.USSD((params, next) => {
  let endSession = false;
  let message = '';
  
  console.log(session);
  //const session = req.session.get(params.sessionId);
  //const user = db.getUserByPhone(params.phoneNumber);

  if (params.text === '') {
      message = "Welcome to ChainAid \n";
      message += "1: Registration \n";
      message += "2: Collect";
  }else if (params.text === '1') {
    message = "Please enter you name \n";
 }else if (params.text === '2') {
    message = Math.floor((Math.random() * 100) + 1) +" \n";
 }
  next({
      response: message, 
      endSession: endSession
  });
});


