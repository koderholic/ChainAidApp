/**
 * Module dependencies.
 */
const express = require('express');
const cors = require("cors")
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');
const options = {
  apiKey: '429647716d4133d9f9cdaf5fa0f3ac7248bbfff447dde16443d4c4842f27749a',         // use your sandbox app API key for development in the test environment
  username: 'sandbox',      // use 'sandbox' for development in the test environment
};
const AfricasTalking = require('africastalking')(options);
const User = require('./models/User');


/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env.example' });

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
const userController = require('./controllers/user');
const ussdController = require('./controllers/ussd');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.use(expressStatusMonitor());
app.use(compression());
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true,
  })
}));

var sessionObj = "";
/*app.use(function (req, res, next) {
  sessionObj = req.session;
    console.log(sessionObj);
    if (!req.session.userState) {
      
    }
    next();
  });
  */


/**
 * Primary app routes.
 */
app.get('/', homeController.index);

app.get('/data/:taxid', userController.getReserve);
app.post('/data', userController.postReserve);


app.get("/alldata", userController.getAllReserves);

//app.post("/ussd", ussdController.postUssd );
var isNewUser;
var currState;
let endSession = false;
let message = '';
app.post("/ussd", (req, res, next)=>{
  console.log(req.session);
  if(req.session.sessionId){
    isNewUser = false;
    currState = req.session.state;
  }else{
    isNewUser = true;
    currState = "menu";
    req.session.telephone = req.body.phoneNumber;
    req.session.state = "menu";
    req.session.sessionId = req.body.sessionId;
    if (req.body.text === '') {
      message = "Welcome to ChainAid \n";
      message += "1: Registration \n";
      message += "2: Collect";
    }
  }

  if (req.body.text === '') {
    req.session.state = "menu";
    message = "Welcome to ChainAid \n";
    message += "1: Registration \n";
    message += "2: Collect";

  }
  if(currState=='menu'){
    if (req.body.text === '1') {
      req.session.state = "1a";
      message = "Please enter your firstname \n"; 
    }else if (req.body.text === '2') {
      req.session.state = "menu";  
      message = "Show this code to the agent " + Math.floor((Math.random() * 10000000) + 1) +" \n";  
      endSession = true;
    
    }
  }else if(currState=="1a"){
    req.session.state = "1b";
    message = "Please enter your lastname \n"; 
    req.session.first_name = req.body.text;
  }
  else if(currState=="1b"){
    req.session.state = "1c";
    message = "Are you Male or Female? \n";
    message += "1: Male \n";
    message += "2: Female";
    req.session.last_name = req.body.text;
  }
  else if(currState=="1c"){
    if (req.body.text === '1') {
      req.session.state = "menu";
      message = "Thanks, you have been registered \n"; 
      req.session.gender = "male";
      endSession = true;
    }else if (req.body.text === '2') {
      req.session.state = "menu";
      message = "Thanks, you have been registered \n"; 
      req.session.gender = "female";
      endSession = true;
    }
  }

  next();
  
}, new AfricasTalking.USSD((params, next) => {
  next({
    response: message, 
    endSession: endSession
});


  
  //console.log(req);
  //const session = req.session.get(params.sessionId);
  //const user = db.getUserByPhone(params.phoneNumber);

  
} 
));





/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
