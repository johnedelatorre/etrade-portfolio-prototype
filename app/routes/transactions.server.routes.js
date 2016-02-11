'use strict';

var transactions = require('../../app/controllers/transactions.server.controller');

module.exports = function(app) {
	// Routing logic   
	// ...
  
  app.route('/transactions')
    .get(transactions.list)
    .post(transactions.create);
};