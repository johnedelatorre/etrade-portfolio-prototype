'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * SoldLot Schema
 */
var SoldLotSchema = new Schema({
	lotType: {
    type: String,
    trim: true
  },
  account: {
      type: Schema.ObjectId,
      ref: 'Account'
  },
  // fill status is open, canceled, confirmed
  fillStatus: {
    type: String,
    default: 'Confirmed',
    trim: true
  },
  symbol: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number
  },
  priceBought: {
    type: Number
  },
  priceSold: {
    type: Number
  },
  timeBought:{
    type: Date
  },
  timeSold: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('SoldLot', SoldLotSchema);