'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * AccountEntryItem Schema
 */
var AccountEntryItemSchema = new Schema({
  // AccountEntryItem model fields   
  symbol: {
    type: String,
    trim: true
  },
  account: {
    type: Schema.ObjectId,
    ref: 'Account'
  },
  lastTrade: {
    type: Number
  },
  changeDollar: {
    type: Number
  },
  changePercent: {
    type: Number
  },
  quantity: {
    type: Number
  },
  value: {
    type: Number
  },
  pricePaid: {
    type: Number
  },
  dayGainDollar: {
    type: Number
  },
  dayGainPercent: {
    type: Number
  },
  totalGainDollar: {
    type: Number
  },
  totalGainPercent: {
    type: Number
  }
});

mongoose.model('AccountEntryItem', AccountEntryItemSchema);