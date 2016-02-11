'use strict';

var trade = require('../../app/controllers/trade.server.controller');

module.exports = function(app) {
	// Routing logic
  app.route('/trade').get(trade.index);
  app.route('/trade/stock').post(trade.createStock);
  app.route('/trade/option').post(trade.createOption);
  app.route('/trade/mutualfund').get(trade.indexmf);
  app.route('/trade/mutualfund').post(trade.createMutualFund);
};