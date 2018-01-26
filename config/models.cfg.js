'use strict';
/*jslint node: true */

module.exports = function() {
    var models = ['account.mdl', 'user.mdl'];
    var model = '';
    models.forEach(function(m) {
        model = require('../models/' + m);
    });
};
