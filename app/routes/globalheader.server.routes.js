'use strict';

var portfolio = require('../../app/controllers/portfolio.server.controller.js');

module.exports = function(app) {

  // This will be a list of all accounts, the cash and stock values in them, etc.
    app.route('/global-header')
	   .get(portfolio.index);
};
