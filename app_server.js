var settings = require('./config/settings');
var logger = require('tracer').colorConsole();

(function() {
  'use strict';
  var express = require('express');
  var app = express();
  var compression = require('compression');
  var http = require('http');
  var server = http.createServer(app);


  app.use(compression());
  // CONFIGURE THE APP & THE DATA MODELS
  require('./config/models.cfg')();
  require('./config/app.cfg')(app);
  require('./config/routes.cfg')(app);

  // START THE SERVER
  logger.info('STARTING THE Airtel SERVER');
  logger.info('Environment:' + settings.values.env);
  logger.info('URL:' + settings.values.config[settings.values.env].server);
  logger.info('Port:' + settings.values.config[settings.values.env].port);
  server.listen(settings.values.config[settings.values.env].port);
  logger.info('Started the server');
  process.on('uncaughtException', function(error) {
    logger.info(error.stack);
    logger.info(error);
  });

})();
