'use strict';

/**
 * Module dependencies.
 */
var request = require('request');

/**
 * Create a Api
 */
exports.getQuotes = function(quotes, callback) {
  if (Array.isArray(quotes)) {
    quotes = quotes.toString();
  }
  var domain = 'v1/market/quote/'+quotes+'.json';
  var options = {
    url: 'http://api.etradecreative.com/v3/' + domain,
    headers: {
      'ConsumerKey': '4bfbff438e3a35641b33643118cb6242'
    }
  };
  request(options, callback);
};