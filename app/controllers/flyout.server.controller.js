'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Position = mongoose.model('Position'),
    Lot = mongoose.model('Lot'),
    SoldLot = mongoose.model('SoldLot'),
    BrokerageAccount = mongoose.model('BrokerageAccount'),
    errorHandler = require('./errors.server.controller'),
    _ = require('lodash'),
    async = require('async'),
    api = require('./api.server.controller'),
    moment = require('moment');

function normalizeLotMap(positions, callback) {
    positions.forEach(function(position) {
        if (position.value.hasOwnProperty('lots')) {
            position.lots = position.value.lots;
        } else {
            position.lots = [];
            position.lots.push(position.value);
        }
        delete position.value;
    });
    if (typeof callback !== 'undefined') {
        callback(null, positions);
    }
}

function objectReduce(objectArray, property, condition) {
    if (typeof condition === 'undefined') {
        condition = function() {
            return true;
        };
    }
    //Grab value from each lot, then add it as a property of the position.
    return objectArray.reduce(function(prev, current, index, array) {
        if (condition(current)) {
            if (typeof current[property] === 'undefined') {
                return prev;
            } else {
                // console.log(current[property]);
                return prev + parseFloat(current[property]);
            }
        } else {
            return prev;
        }
    }, 0);
}
/**
 * Create a Portfolio
 */
exports.create = function(req, res) {};
/**
 * Show the current Portfolio
 */
exports.position = function(req, res) {
    // res.json(req.position);
};
exports.read = function(req, res) {
    function extractMarketData(response, body, callback) {
        // if (err) return res(err);
        //How to fetch symbol from quote response
        // console.log(JSON.parse(body).QuoteResponse.QuoteData[0].Product.symbol);
        req.marketData = {};
        JSON.parse(body).QuoteResponse.QuoteData.forEach(function(quote, index, array) {
            var symbol = quote.Product.symbol;
            req.marketData[symbol] = quote.All;
        });
        callback(null);
    }

    function addMarketDataToPosition(callback) {

        req.positionsInAccount.forEach(function(position, index, array) {
            var data = ['companyName', 'lastTrade', 'changeClose', 'changeClosePercentage', 'lotType', 'totalVolume', 'bid', 'ask', 'low', 'high', 'high52', 'low52', 'dividend', 'exDividendDate', 'dividendPayableDate'];
            var reformatPosId = position._id.split(' ', 1);
            data.map(function(property) {
                if (req.marketData[reformatPosId].hasOwnProperty(property)) {
                    position[property] = req.marketData[reformatPosId][property];
                }
            });
        });
        callback(null);
    }
    // function populateLotsFromQuoteData(){
    //     req.positionsInAccount.forEach()
    // }
    function sumLotChangesIntoPosition(callback) {
        req.positionsInAccount.forEach(function(position, index, array) {
            position.lots.forEach(function(lot, lotIndex, lotArray) {
                //This options rendering is terribly faked
                if (lot.lotType === 'option') {
                    lot.quantity = 1;
                    var strikeInfo = lot.legs[0].relatedStrikeInfo;
                    lot.value = strikeInfo.lastPrice;
                    lot.pricePaidPerShare = strikeInfo.bid;
                    lot.pricePaid = lot.quantity * strikeInfo.bid;
                } else {
                    lot.value = lot.quantity * position.lastTrade;
                    lot.pricePaid = lot.quantity * lot.pricePaidPerShare;
                }
                lot.totalGainDollar = lot.value - lot.pricePaid;
                lot.totalGainPercent = lot.totalGainDollar / lot.value * 100;
                lot.dayGainPercent = position.changeClosePercentage;
                lot.dayGainDollar = position.changeClose * lot.quantity;
                if (moment(lot.created).isSame(moment(), 'day')) {
                    lot.dayGainDollar = lot.totalGainDollar;
                    lot.dayGainPercent = lot.totalGainPercent;
                }
            });
            position.value = parseFloat(objectReduce(position.lots, 'value').toFixed(2));
            position.quantity = parseFloat(objectReduce(position.lots, 'quantity'));
            position.estIncome = parseFloat(position.quantity * position.dividend);
            position.dayGainDollar = parseFloat(objectReduce(position.lots, 'dayGainDollar').toFixed(2));
            position.pricePaid = parseFloat(objectReduce(position.lots, 'pricePaid').toFixed(2));
            //unweighted average. Not really quite right, but close enough for now.
            position.pricePaidPerShare = (parseFloat(objectReduce(position.lots, 'pricePaidPerShare')) / position.lots.length).toFixed(2);
            position.totalGainDollar = parseFloat(objectReduce(position.lots, 'totalGainDollar').toFixed(2));
            position.dayGainPercent = parseFloat((position.dayGainDollar / (position.value - position.dayGainDollar) * 100).toFixed(2));
            position.totalGainPercent = parseFloat(position.totalGainDollar / position.value * 100);
            position.lastTrade = position.lastTrade.toFixed(2);
            if (position.lots[0].lotType === 'option') {
                var strikeInfo = position.lots[0].legs[0].relatedStrikeInfo;
                // console.log(strikeInfo);
                position.lastTrade = strikeInfo.lastPrice.toFixed(2);
                position.changeClose = strikeInfo.ask;
                // position.changeClosePercentage = (position.changeClose/(strikeInfo.lastPrice-strikeInfo.ask))*100.toFixed(2);
            }
        });
        callback(null);
    }

    function summarizeOneAccount(accountSummary) {
        accountSummary.positionsValue = 0;
        accountSummary.dayGainDollar = 0;
        accountSummary.totalGainDollar = 0;
        accountSummary.positionsValue = parseFloat(objectReduce(req.positionsInAccount, 'value').toFixed(2));
        accountSummary.dayGainDollar = parseFloat(objectReduce(req.positionsInAccount, 'dayGainDollar').toFixed(2));
        accountSummary.totalGainDollar = parseFloat(objectReduce(req.positionsInAccount, 'totalGainDollar').toFixed(2));
        accountSummary.dayGainPercent = parseFloat((accountSummary.dayGainDollar / (accountSummary.positionsValue - accountSummary.dayGainDollar) * 100).toFixed(2));
        accountSummary.totalGainPercent = parseFloat((accountSummary.totalGainDollar / (accountSummary.positionsValue - accountSummary.totalGainDollar) * 100).toFixed(2));
        accountSummary.value = accountSummary.positionsValue + accountSummary.purchasingPower;
    }

    function summarizeAccounts(callback) {
        var accountSummary = {};
        if (!query.query.hasOwnProperty('account')) {
            BrokerageAccount.find().lean().exec(function(err, accountData) {
                if (err) return res(err);
                //This function is still useful, but some of the logic can't be used when calculating for all accounts, since positions aren't separated by account in the request. There may be some more logic issues in the rest of this callback but I can't take the time to find them right now for a prototype.
                accountData.forEach(summarizeOneAccount);
                var summary = {};
                summary.purchasingPower = objectReduce(accountData, 'purchasingPower').toFixed(2);
                summary.positionsValue = objectReduce(req.positionsInAccount, 'value').toFixed(2);
                summary.dayGainDollar = objectReduce(req.positionsInAccount, 'dayGainDollar').toFixed(2);
                summary.totalGainDollar = objectReduce(req.positionsInAccount, 'totalGainDollar').toFixed(2);
                summary.dayGainPercent = (summary.dayGainDollar / (summary.positionsValue - summary.dayGainDollar) * 100).toFixed(2);
                summary.totalGainPercent = (summary.totalGainDollar / (summary.positionsValue - summary.totalGainDollar) * 100).toFixed(2);
                summary.value = parseFloat(summary.purchasingPower) + parseFloat(summary.positionsValue);
                req.accountSummary = summary;
                callback(null);
            });
        } else {
            BrokerageAccount.find({
                '_id': req.accountId
            }).lean().exec(function(err, accountData) {
                if (err) return res(err);
                accountSummary = accountData[0];
                summarizeOneAccount(accountSummary);
                req.accountSummary = accountSummary;
                callback(null);
            });
        }
    }

    function parseAndFetchMarketData(err, positionsInAccount, callback) {

        if (err) return res(err);
        positionsInAccount = positionsInAccount.filter(function(position) {
            if (position.lots.length > 0) {
                return true;
            }
        });
        if (positionsInAccount.length === 0) {
            req.errorMessage = 'No positions';
            callback(null);
            // summarizeAccounts(callback);
            return;
        }
        var symbols = positionsInAccount.map(function(position) {
            return position._id.split(' ', 1);
        });
        req.positionsInAccount = positionsInAccount;
        callback(null, symbols);
    }
    //AccountById starts here
    var query = {};
    query.query = {
        'fillStatus': 'Executed'
    };
    if (req.accountId !== 'all') {
        query.query.account = req.accountId;
    }
    query.map = function() {
        
        if (this.displaySymbol) {
            emit(this.displaySymbol, {
                symbol: this.symbol,
                quantity: this.quantity,
                created: this.created,
                fillStatus: this.fillStatus,
                account: this.account,
                lotType: this.lotType,
                priceType: this.priceType,
                orderType: this.orderType,
                pricePaid: this.pricePaid,
                pricePaidPerShare: this.lastTrade,
                pricePaidWithCommission: this.pricePaidWithCommission,
                commission: this.commission,
                legs: this.legs
            });
        } else {
            emit(this.symbol, {
                symbol: this.symbol,
                quantity: this.quantity,
                created: this.created,
                fillStatus: this.fillStatus,
                account: this.account,
                lotType: this.lotType,
                priceType: this.priceType,
                orderType: this.orderType,
                pricePaid: this.pricePaid,
                pricePaidPerShare: this.lastTrade,
                pricePaidWithCommission: this.pricePaidWithCommission,
                commission: this.commission
            });
        }
    };
    query.reduce = function(keys, values) {
        var reduced = {

            lots: []
        };

        for (var i in values) {
            reduced.lots.push(values[i]);
        }
        return reduced;
    };

    function respond() {
        var mutualFund = [{
                    _id: 'POAGX',
                    lots: [{
                        symbol: 'POAGX',
                        quantity: 520,
                        created: 1426255007000,
                        fillStatus: 'Executed',
                        account: '546f9fc6d664dfcab60fd2b7',
                        lotType: 'mutual-fund',
                        priceType: 'market',
                        orderType: 'buy',
                        pricePaid: 18208.44,
                        pricePaidPerShare: 35.01,
                        pricePaidWithCommission: 61524.99,
                        commission: 9.99,
                        value: 18742.275,
                        totalGainDollar: 1067.672000000006,
                        totalGainPercent: 2.848298680480444,
                        dayGainPercent: 0.06,
                        dayGainDollar: 22.791999999999998
                    }],
                    companyName: 'PRIMECAP Odyssey Aggressive Growth Fund',
                    lastTrade: '35.67',
                    changeClose: 0.077,
                    changeClosePercentage: 0.06,
                    totalVolume: 14633356,
                    bid: 126.62,
                    ask: 126.64,
                    low: 125.26,
                    high: 126.78,
                    high52: 133.6,
                    low52: 73.0471,
                    dividend: 0.47,
                    exDividendDate: 1423151910,
                    dividendPayableDate: 1423756710,
                    value: 18742.275,
                    quantity: 520,
                    estIncome: 139.12,
                    dayGainDollar: 22.79,
                    pricePaid: 18208.44,
                    pricePaidPerShare: '35.01',
                    totalGainDollar: 1067.67,
                    dayGainPercent: 0.06,
                    totalGainPercent: 2.848293496920731
                },
                {
                    _id: '00206RAM4',
                    lots: [{
                        symbol: '00206RAM4',
                        quantity: 25000,
                        created: 1426255007000,
                        fillStatus: 'Executed',
                        account: '546f9fc6d664dfcab60fd2b7',
                        lotType: 'bond',
                        priceType: 'market',
                        orderType: 'buy',
                        pricePaid: 98.00,
                        pricePaidPerShare: 98.00,
                        pricePaidWithCommission: 98.00,
                        commission: 9.99,
                        value: 24500.00,
                        totalGainDollar: 0.00,
                        totalGainPercent: 0.00,
                        dayGainPercent: 0.00,
                        dayGainDollar: 0.00
                    }],
                    companyName: 'PRIMECAP Odyssey Aggressive Growth Fund',
                    lastTrade: '98.00',
                    changeClose: 0.00,
                    changeClosePercentage: 0.00,
                    totalVolume: 14633356,
                    bid: 126.62,
                    ask: 126.64,
                    low: 125.26,
                    high: 126.78,
                    high52: 133.6,
                    low52: 73.0471,
                    dividend: 0.47,
                    exDividendDate: 1423151910,
                    dividendPayableDate: 1423756710,
                    value: 24500.00,
                    quantity: 25000,
                    estIncome: 139.12,
                    dayGainDollar: 0.00,
                    pricePaid: 18208.44,
                    pricePaidPerShare: '35.01',
                    totalGainDollar: 0.00,
                    dayGainPercent: 0.00,
                    totalGainPercent: 0.00
                }];
        // console.log(req.accountSummary);
        req.accountSummary.positionsValue+=(18742.275+24500);
        req.accountSummary.value +=(18742.275+24500);
        res.json({
            error: req.errorMessage,
            positions: req.positionsInAccount.concat(mutualFund),
            open: req.openOrders,
            summary: req.accountSummary
        });
    }
    //I have no idea if this is a race condition or the right way of doing this.
    async.parallel({
        executed: function(callback) {
            Lot.mapReduce(query, function(err, results) {
                //Massage the results into the same format for one lot or multiple lots
                async.waterfall([

                    function(callback) {
                        normalizeLotMap(results, callback);
                    },
                    function(results, callback) {
                        parseAndFetchMarketData(err, results, callback);
                    },
                    function(symbols, callback) {
                        //todo: check if symbols is null. If so, jump to summarizeAccounts. Something involving callback(true) to break this waterfall.
                        api.getQuotes(symbols, callback);
                    },
                    function(response, body, callback) {
                        extractMarketData(response, body, callback);
                    },
                    function(callback) {
                        addMarketDataToPosition(callback);
                    },
                    function(callback) {
                        sumLotChangesIntoPosition(callback);
                    },
                    function(callback) {
                        summarizeAccounts(callback);
                    }
                ], function(err, result) {
                    callback(null);
                });
            });
        },
        open: function(callback) {
            query.query.fillStatus = 'Open';
            Lot.find(query.query).lean().exec(function(err, results) {
                req.openOrders = results;
                callback();
            });
        }
    }, function(err, results) {
        // console.log('responding');
        // console.log(Object.keys(res));
        respond();
    });
};
exports.gains = function(req, res) {
    var query = {
        query: {}
    };
    query.map = function() {
        emit(this.symbol, {
            symbol: this.symbol,
            account: this.account,
            quantity: this.quantity,
            timeBought: this.timeBought,
            timeSold: this.timeSold,
            priceSold: this.priceSold.toFixed(2),
            priceBought: this.priceBought.toFixed(2),
            proceeds: (this.priceSold * this.quantity).toFixed(2),
            totalCost: (this.quantity * this.priceBought).toFixed(2),
            gainLoss: ((this.priceSold - this.priceBought) * this.quantity).toFixed(2),
            term: this.timeSold - this.timeBought > 31536000000 ? 'Long' : 'Short'
        });
    };
    query.reduce = function(keys, values) {
        var reduced = {
            lots: []
        };
        for (var i in values) {
            reduced.lots.push(values[i]);
        }
        return reduced;
    };
    if (req.accountId !== 'all') {
        query.query.account = req.accountId;
    }
    SoldLot.mapReduce(query, function(err, results) {
        normalizeLotMap(results, function(err, positions) {
            positions.forEach(function(position) {
                //A little WET, but I don't want to abstract this more
                position.quantity = objectReduce(position.lots, 'quantity');
                position.totalCost = objectReduce(position.lots, 'totalCost');
                position.proceeds = objectReduce(position.lots, 'proceeds');
                position.gainLoss = objectReduce(position.lots, 'gainLoss');
            });
            req.soldLots = positions;
            res.json(req.soldLots);
        });
    });
};
exports.accountById = function(req, res, next, accountId) {
    //I could probably refactor this to do something if accountId == 'all' but it causes the portfolio.read to mess up.
    req.accountId = accountId;
    next();
};
exports.handleQuoteResponse = function(quotes) {
    // console.log(quotes.QuoteResponse.QuoteData);
};
exports.positionById = function(req, res, next, positionId) {
    // console.log('position');
    // BrokerageAccountEntry.find({_id:positionId}).exec(function(err, position){
    //   if (err) return next(err);
    //   if (!position) return next(new Error('Failed to locate position'));
    //   req.position = position;
    next();
    // });
};
/**
 * Update a Portfolio
 */
exports.update = function(req, res) {};
/**
 * Delete an Portfolio
 */
exports.delete = function(req, res) {};
/**
 * List of Portfolios
 */
exports.list = function(req, res) {};
exports.index = function(req, res) {
    BrokerageAccount.find().exec(function(err, BrokerageAccount) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(BrokerageAccount);
        }
    });
    // probably loop over the Position collection to populate the Lots Array and make a new array of the Symbols
    // then you can probably do api.getQuotes(array); and console.log() the response
    // and then you can probably loop over that response and update the necessary collections finding the entry by ID?
};