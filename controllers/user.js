const { promisify } = require('util');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const randomBytesAsync = promisify(crypto.randomBytes);


/**
 * POST /data
 * Create a new token name reserve.
 */
exports.postReserve = (req, res, next) => {
  const user = new User(
    req.body
  );
  User.findOne({ taxid: req.body.taxid }, (err, existingUser) => {
    if (existingUser) {
      return res.status(503).json({
        error: "user already filled tax form"
      })
    }
    user.save((err) => {
      if (err) { 
        return res.status(503).json({
          error: "user already filled tax form"
        })
      }
      return res.status(200).json({
        success: "success"
      })
    });
  });
}

/**
 * GET /reserve/:tokenname
 * Get If token name is already reserved.
 */
exports.getReserve = (req, res, next) => {
  
  User
    .findOne({ taxid: req.params.taxid })
    .exec((err, user) => {
      if (err) { 
        return res.status(503).json({
        error: `not found`
        }); 
      }
      return res.status(200).json({
        user
      });
    });
};


exports.getAllReserves = (req, res, next) => {
  User.find({}).then(resp => {
    if(!resp) {
      return res.status(503).json({
        error: "No Available reserves found"
      })
    }
    return res.status(200).json(resp)
  }).catch(err => {
    if (err) { return next(err); }
  })
}