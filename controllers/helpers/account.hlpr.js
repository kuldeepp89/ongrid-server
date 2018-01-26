'use strict';
/*jslint node: true */

var keygen = require('keygenerator');
var mongoose = require('mongoose');
var moment = require('moment');
var Q = require('q');
var logger = require('tracer').colorConsole();

require('../../models/auth_token.mdl.js');
require('../../models/account.mdl.js');
require('../../models/user.mdl.js');
var AuthToken = mongoose.model('AuthToken');
var Account = mongoose.model('Account');
var User = mongoose.model('User');
var Event = mongoose.model('Event');
var _ = require('underscore');