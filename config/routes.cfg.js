'use strict';
/*jslint node: true */

var mustBe = require('mustbe').routeHelpers();

var mongoose = require('mongoose');
var passport = require('passport');
var path     = require('path');
var rootPath = path.join(__dirname, "../../ongrid-frontend");
module.exports = function(app) {

  (function UserRoutes() {
    
    
    var UserCtrl = require('../controllers/user.ctrl');
    app.route('/auth/google').get(passport.authenticate('google', {
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    }));
    app.route('/auth/google/callback').get(UserCtrl.oauthCallback('google'));
    
  })();
  
  (function OtherRoutes() {

    app.get('/:url(*)', function(req, res){
      res.send('Error 404 Not Found');
    })
  })();
};
