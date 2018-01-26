'use strict';
/*jslint node: true */

var Q = require('q');
var _ = require('underscore');
var ld = require('lodash');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var async = require('async');
var request = require('request');
var logger = require('tracer').colorConsole();


module.exports.get_status = function(user_details) {
  logger.log();
  console.log(user_details);
  var deferred = Q.defer();  
    
  Bill.find({
  	phone: user_details.phone,
  	isPaid: user_details.isPaid
  }).exec(function(err, bills) {
  	if(err){
  		deferred.reject(err);
  	}
  	else if(!bills.length){
  		deferred.resolve("no bill pending");
  	}
  	else{
  		console.logger
  		var bill = bills[0];
  		console.logger
  		var today = new Date();
		var generatedAt = new Date(bill.generatedAt);
		console.log(today);
		console.log(generatedAt);
		var timeDiff = Math.abs(today.getTime() - generatedAt.getTime());
		console.log(timeDiff / (1000 * 3600 * 24))
		var diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));

		console.log(diffDays);
  		if(!diffDays){
  			deferred.resolve({
	            data: 0,
	            message: 'Bill generated'
	        });
  		}
  		else if(diffDays <= 3){
  			deferred.resolve({
	            data: diffDays,
	            message: 'Bill payment reminder one'
	        });
  		}
  		else if(diffDays > 3 && diffDays <= 7){
  			deferred.resolve({
	            data: diffDays,
	            message: 'Bill payment reminder two'
	        });
  		}
  		else if(diffDays >=15){
  			deferred.resolve({
	            data: diffDays,
	            message: 'Service Blocked'
	        });
  		}  	  		
  	}
  })
  return deferred.promise;
};

module.exports.generate_bill = function(phone, from, to, dueDate) {
  logger.log();
  var deferred = Q.defer();
  
  var bill = {};
  bill.phone = phone;
  bill.period = {};
  bill.period.from = from;
  bill.period.to = to;
  bill.dueDate = dueDate;
  bill.amount = 199;

  bill = new Bill(bill);
  bill.save(function(err, bill){
  	if(err){
  		deferred.reject(err);
  	}
  	else{
  		deferred.resolve(bill);
  	}
  })

  return deferred.promise;
};

