'use strict';

angular.module('core').factory('api', ['$resource', function($resource) {

    var domain = 'http://api.etradecreative.com/v3/';
    // var domain = 'http://localhost:9001/api/';
    return {
        quote: function(symbol, options) {
            return $resource(domain + 'v1/market/quote/' + symbol + '.json', options).get();
        },
        mutualFund: function(symbol, options) {
            return $resource(domain+ 'v1/market/quote/' + symbol + '.json?detailFlag=MF_DETAIL', options).get();
        },
        optionExpireDate: function(symbol, options) {
            return $resource(domain + 'v1/market/optionexpiredate.json?symbol=' + symbol + '&expiryType=ALL', options).get();
        },
        optionStrikePrices: function(symbol, expiryDate, chainType) {
            return $resource(domain+ 'v1/market/optionstrikeprices.json?symbol=' + symbol + '&expiryYear=' + expiryDate.year + '&expiryMonth=' + expiryDate.month + '&expiryDay=' + expiryDate.day + '&chainType=' + chainType).get();
        },
        optionChain: function(obj) {
            // symbol: required
            // chainType: optional
            // priceType: optional
            // strikePriceNear: int/optional
            // noOfStrikes: int/optional
            // expiryDay: int/optional
            // expiryMonth: int/optional
            // expiryYear: int/optional
            // includeWeekly: bool/optional
            // skipAdjusted: bool/optional
            // optionCategory: string/optional
            var url = domain + 'v1/market/optionchains.json?symbol=' + obj.symbol;
            if (obj.chainType) { url += '&chainType=' + obj.chainType; }
            if (obj.priceType) { url += '&priceType=' + obj.priceType; }
            if (obj.strikePriceNear) { url += '&strikePriceNear=' + obj.strikePriceNear; }
            if (obj.noOfStrikes) { url += '&noOfStrikes=' + obj.noOfStrikes; }
            if (obj.expiryDay) { url += '&expiryDay=' + obj.expiryDay; }
            if (obj.expiryMonth) { url += '&expiryMonth=' + obj.expiryMonth; }
            if (obj.expiryMonth) { url += '&expiryYear=' + obj.expiryYear; }
            if (obj.includeWeekly) { url += '&includeWeekly=' + obj.includeWeekly; }
            if (obj.skipAdjusted) { url += '&skipAdjusted=' + obj.skipAdjusted; }
            if (obj.optionCategory) { url += '&optionCategory=' + obj.optionCategory; }

            return $resource(url).get();
        },
        news: function(source, options) {
            if (options.hasOwnProperty('symbol')) {
                if (options.symbol.constructor === Array) {
                    options.symbol = options.symbol.toString();
                }
            }
            return $resource(domain + 'v1/market/news/' + source + '.json', options).get();
        },
        earnings: function(symbol, options) {
            return $resource(domain + 'v1/market/earnings/' + symbol + '.json', options).get();
        }
    };
}]);
