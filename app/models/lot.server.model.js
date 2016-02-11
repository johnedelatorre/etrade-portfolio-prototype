'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Lot Schema
 */
var LotSchema = new Schema({
	// Position model fields
  //lot type is stock, bond, mutual fund, option
	lotType: {
    type: String,
    trim: true
  },
  position: {
    type: Schema.ObjectId,
    ref: 'Position'
  },
  account: {
      type: Schema.ObjectId,
      ref: 'Account'
  },
  // fill status is open, canceled, confirmed
  fillStatus: {
    type: String,
    default: 'Open',
    trim: true
  },
  // price type is market, market on close, limit, stop on quote, stop limit on quote, trailing stop $, trailing stop %
  priceType: {
    type: String,
    trim: true
  },
  //not sure if we need this in DB but order type is buy, sell, sell short, buy to cover
  orderType: {
    type: String,
    trim: true
  },
  symbol: {
    type: String,
    trim: true
  },
  lastTrade: {
    type: Number
  },
  bid: {
    type: Number
  },
  ask: {
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
  pricePaidWithCommission: {
    type: Number
  },
  commission: {
    type: Number
  },
  limitPrice: {
    type: Number
  },
  legs: [],
  displaySymbol: {
    type: String
  },
  strategy: {
    type: String,
    trim: true
  },
  fee: {
    type: Number
  },
  term: {
    type: String
  },
  netAssetValue: {
    type: Number
  },
  fundFamily: {
    type: String
  },
  investmentAmount: {
    type: Number
  },
  fauxShares: {
    type: Number
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Lot', LotSchema);