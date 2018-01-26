'use strict';
/*jslint node: true */

var express = require('express'),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  morgan = require('morgan'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  favicon = require('serve-favicon'),
  errorhandler = require('errorhandler'),
  multer = require('multer'),
  MongoStore = require('connect-mongo/es5')(session),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,  
  logger = require('tracer').colorConsole();
  var compression = require('compression');

var settings = require('./settings');
var UserCtrl = require('../controllers/user.ctrl')
var env_config = settings.values.config[settings.values.env];
var google_config = settings.values.config['google'];
var session_store = new MongoStore({
  url: env_config.db_uri,
  clear_interval: env_config.clear_interval
});


module.exports = function(app) {
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(multer());
  app.use(cookieParser('decode-Sessions'));
  app.use(session({
    secret: "decode-Sessions",
    cookie: {
      maxAge: 31536000000
    },
    store: session_store,
    resave: true,
    saveUninitialized: true
  }));
  app.use(methodOverride());

  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new GoogleStrategy({
      clientID: google_config.clientID,
      clientSecret: google_config.clientSecret,
      callbackURL: google_config.callbackURL,
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
      // Set the provider data and include tokens
      var providerData = profile._json;
      providerData.accessToken = accessToken;
      providerData.refreshToken = refreshToken;

      // Create the user OAuth profile
      var providerUserProfile = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        username: profile.username,
        provider: 'google',
        providerIdentifierField: 'id',
        providerData: providerData
      };

      // Save the user OAuth profile
      UserCtrl.saveOAuthUserProfile(req, providerUserProfile, done);
    }
  ));
  app.use(compression());
  app.use(express.static(__dirname + '/../../ongrid-frontend/dist/'));

  app.all("/api/*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, HEAD, DELETE, OPTIONS");
    return next();
  });

  
  app.use(errorhandler({
    dumpExceptions: true,
    showStack: true
  }));
  mongoose.connect(env_config.db_uri);

  // CONNECTION EVENTS
  // When successfully connected
  mongoose.connection.on('connected', function() {
    logger.info('Mongoose default connection open to: ' + env_config.server);
  });

  // If the connection throws an error
  mongoose.connection.on('error', function(err) {
    logger.error('Mongoose default connection error: ' + err);
  });

  // When the connection is disconnected
  mongoose.connection.on('disconnected', function() {
    logger.warn('Mongoose default connection disconnected');
  });

 

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', function() {
    mongoose.connection.close(function() {
      logger.info('Mongoose default connection disconnected through app termination');
      process.exit(0);
    });
  });
};
