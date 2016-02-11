'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Transaction Schema
 */
var TransactionSchema = new Schema({
  orderType: {
    type: String
  },
	symbol: {
    type: String,
    default: '',
    trim: true,
    required: 'Symbol cannot be blank'
  },
  lastTrade: {
    type: Number
  },
  quantity: {
    type: Number
  },
  priceType: {
    type: String,
    trim: true
  },
  term: {
    type: String,
    trim: true
  },
  price: {
    type: String,
    trim: true
  },
  bid: {
    type: Number
  },
  ask: {
    type: Number
  },
  status: {
    type: String
  }
});

mongoose.model('Transaction', TransactionSchema);