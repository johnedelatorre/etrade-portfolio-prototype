'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * BrokerageAccount Schema
 */
var BrokerageAccountSchema = new Schema({
	// BrokerageAccount model fields   
	user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  accountNumber: {
    type: String
  },
  purchasingPower: {
    type: Number
  },
  positionsValue: {
    type: Number
  },
  accountName: {
    type: String
  }
});

mongoose.model('BrokerageAccount', BrokerageAccountSchema);