'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    BrokerageAccount = mongoose.model('BrokerageAccount'),
    errorHandler = require('./errors.server.controller'),
    _ = require('lodash');

exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

exports.accounts = function(req, res){
  BrokerageAccount.find().lean().exec(function(err, BrokerageAccount){
    if (err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      BrokerageAccount.forEach(function(element){
        element.displayName = element.accountName + ' - ' + element.accountNumber.slice(-4);
      });
      res.json(BrokerageAccount);
    }
  });
};