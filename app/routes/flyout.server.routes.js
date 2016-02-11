'use strict';

var portfolio = require('../../app/controllers/flyout.server.controller.js');

module.exports = function(app) {

  // This will be a list of all accounts, the cash and stock values in them, etc.
    app.route('/flyout')
        .get(portfolio.index);
    app.route('/flyout/:accountId')
        .get(portfolio.read);
    app.route('/flyout/:accountId/:positionId')
        .get(portfolio.position);
    app.route('/gains/:accountId')
        .get(portfolio.gains);

    app.param('accountId', portfolio.accountById);
    app.param('positionId', portfolio.positionById);
};