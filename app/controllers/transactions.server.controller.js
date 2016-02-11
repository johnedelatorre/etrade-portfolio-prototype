'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Transaction = mongoose.model('Transaction'),
    _ = require('lodash');

/**
 * Create a Transaction
 */
exports.create = function(req, res) {
  var transaction = new Transaction(req.body);
  console.log(transaction);

  transaction.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(transaction);
    }
  });
};

/**
 * Show the current Transaction
 */
exports.read = function(req, res) {

};

/**
 * Update a Transaction
 */
exports.update = function(req, res) {

};

/**
 * Delete an Transaction
 */
exports.delete = function(req, res) {

};

/**
 * List of Transactions
 */
exports.list = function(req, res) {
  Transaction.find().exec(function(err, transactions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(transactions);
    }
  });
};