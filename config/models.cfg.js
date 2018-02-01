'use strict';
/*jslint node: true */

module.exports = function() {
    var models = ['user.mdl'];
    var model = '';
    models.forEach(function(m) {
        model = require('../models/' + m);
    });
};
