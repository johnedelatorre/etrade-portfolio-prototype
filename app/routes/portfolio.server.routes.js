'use strict';

var portfolio = require('../../app/controllers/portfolio.server.controller.js');

module.exports = function(app) {

  // This will be a list of all accounts, the cash and stock values in them, etc.
    app.route('/accounts')
        .get(portfolio.index);
    app.route('/accounts/:accountId')
        .get(portfolio.read);
    app.route('/accounts/:accountId/:positionId')
        .get(portfolio.position);
    // app.route('/gains')
	// .get(portfolio.gains);
    app.route('/gains/:accountId')
	.get(portfolio.gains);

    app.param('accountId', portfolio.accountById);
    app.param('positionId', portfolio.positionById);
};