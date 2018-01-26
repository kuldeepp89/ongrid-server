'use strict';
/*jslint node: true */

module.exports.values = {
  'env': 'LOCAL',
  'config': {
    'LOCAL': {
      'server': 'http://localhost',
      'port': 8000,
      'db_uri': 'mongodb://localhost/ongrid',
      'clear_interval': 3600
    },
    'aws': {
      region: 'ap-southeast-1',
      accessKeyId: process.env.ACCESS_KEY_ID || '<default-here>',
      secretAccessKey: process.env.SECRET_KEY || '<dummy-here>'
    },
    'google': {
      clientID: process.env.GOOGLE_ID || 'your-id',
      clientSecret: process.env.GOOGLE_SECRET || 'yourkey',
      callbackURL: '/auth/google/callback'
    }
  }
};
