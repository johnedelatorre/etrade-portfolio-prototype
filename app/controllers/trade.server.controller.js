'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    Transaction = mongoose.model('Transaction'),
    Position = mongoose.model('Position'),
    BrokerageAccount = mongoose.model('BrokerageAccount'),
    errorHandler = require('./errors.server.controller'),
    Lot = mongoose.model('Lot'),
    SoldLot = mongoose.model('SoldLot'),
    api = require('./api.server.controller'),
    _ = require('lodash');

/**
 * Index for Trade
 */

exports.index = function(req, res) {
    async.parallel({
        openOrders: function(callback) {
            if (req.query.symbol) {
                Position.find({
                    'account': new mongoose.Types.ObjectId(req.query.accountId),
                    'symbol': req.query.symbol
                }).populate('lots', null, {
                    fillStatus: {
                        $in: ['Open']
                    }
                }).lean().exec(function(err, positions) {
                    var openLots = [];
                    positions.forEach(function(position, index) {
                        if (position.lots.length > 0) {
                            openLots.push(position.lots);
                        }
                    });
                    if (openLots.length > 0) {
                        callback(null, _.flatten(openLots));
                    } else {
                        callback(null, {
                            errorMessages: ['No open orders for this account.']
                        });
                    }
                });
            } else {
                Position.find({
                    'account': new mongoose.Types.ObjectId(req.query.accountId)
                }).populate('lots', null, {
                    fillStatus: {
                        $in: ['Open']
                    }
                }).lean().exec(function(err, positions) {
                    var openLots = [];
                    positions.forEach(function(position, index) {
                        if (position.lots.length > 0) {
                            openLots.push(position.lots);
                        }
                    });
                    if (openLots.length > 0) {
                        callback(null, _.flatten(openLots));
                    } else {
                        callback(null, {
                            errorMessages: ['No positions held for this account.']
                        });
                    }
                });
            }
        },
        positionsHeld: function(callback) {
            if (req.query.symbol) {
                Position.find({
                    'account': new mongoose.Types.ObjectId(req.query.accountId),
                    'symbol': req.query.symbol
                }).populate('lots', null, {
                    fillStatus: {
                        $in: ['Executed']
                    }
                }).lean().exec(function(err, positions) {
                    var positionsHeld = [];
                    var symbols = [];
                    async.series([
                        function(callback) {
                            positions.forEach(function(position, index) {
                                position.quantity = 0;
                                symbols.push(position.symbol);
                                position.lots.forEach(function(lot, lotIndex) {
                                    position.quantity += lot.quantity;
                                });
                                callback();
                            });
                        },
                        function(err) {
                            req.marketData = {};
                            api.getQuotes(symbols, function(err, res, body) {
                                if (!err && res.statusCode === 200) {
                                    JSON.parse(body).QuoteResponse.QuoteData.forEach(function(quote, index, array) {
                                        var symbol = quote.Product.symbol;
                                        if (quote.All) {
                                            req.marketData[symbol] = quote.All;
                                        } else if (quote.MutualFund) {
                                            req.marketData[symbol] = quote.MutualFund;
                                        }
                                    });
                                }
                                positions.forEach(function(position, index, array) {
                                    position.bid = req.marketData[position.symbol].bid || 0;
                                    position.ask = req.marketData[position.symbol].ask || 0;

                                    if (position.lots.length > 0) {
                                        position.lotType = position.lots[0].lotType || '';
                                        positionsHeld.push(position);
                                    }
                                });
                                if (positionsHeld.length > 0) {
                                    callback(null, positionsHeld);
                                } else {
                                    callback(null, {
                                        errorMessages: ['No positions for this stock.']
                                    });
                                }
                            });
                        }
                    ]);
                });
            } else {
                Position.find({
                    'account': new mongoose.Types.ObjectId(req.query.accountId)
                }).populate('lots', null, {
                    fillStatus: {
                        $in: ['Executed']
                    }
                }).lean().exec(function(err, positions) {
                    var positionsHeld = [];
                    var symbols = [];
                    async.series([
                        function(callback) {
                            positions.forEach(function(position, index) {
                                position.quantity = 0;
                                symbols.push(position.symbol);
                                position.lots.forEach(function(lot, lotIndex) {
                                    position.quantity += lot.quantity;
                                });
                            });
                            callback();
                        },
                        function(err) {
                            req.marketData = {};
                            api.getQuotes(symbols.join(','), function(err, res, body) {
                                if (!err && res.statusCode === 200) {
                                    JSON.parse(body).QuoteResponse.QuoteData.forEach(function(quote, index, array) {
                                        var symbol = quote.Product.symbol;
                                        if (quote.All) {
                                            req.marketData[symbol] = quote.All;
                                        } else if (quote.MutualFund) {
                                            req.marketData[symbol] = quote.MutualFund;
                                        }
                                    });
                                }
                                positions.forEach(function(position, index) {
                                    position.bid = req.marketData[position.symbol].bid || 0;
                                    position.ask = req.marketData[position.symbol].ask || 0;

                                    if (position.lots.length > 0) {
                                        positionsHeld.push(position);
                                    }
                                });
                                if (positionsHeld.length > 0) {
                                    callback(null, positionsHeld);
                                } else {
                                    callback(null, {
                                        errorMessages: ['No positions for this stock.']
                                    });
                                }
                            });
                        }
                    ]);
                });
            }
        },
        lots: function(callback) {
            if (req.query.symbol) {
                Lot.find({
                    'account': new mongoose.Types.ObjectId(req.query.accountId),
                    'symbol': req.query.symbol,
                    'fillStatus': 'Executed',
                    'lotType': 'stock'
                }).lean().exec(function(err, lots) {
                    if (lots.length) {
                        callback(null, lots);
                    } else {
                        callback(null, {
                            errorMessages: ['No lots for this stock.']
                        });
                    }
                });
            } else {
                Lot.find({
                    'account': new mongoose.Types.ObjectId(req.query.accountId),
                    'fillStatus': 'Executed',
                    'lotType': 'stock'
                }).lean().exec(function(err, lots) {
                    if (lots.length) {
                        callback(null, lots);
                    } else {
                        callback(null, {
                            errorMessages: ['No lots for this stock.']
                        });
                    }
                });
            }
        }
    },
    function(err, results) {
        res.json(results);
    });
};

/**
 * Create a Stock Trade
 */
exports.createStock = function(req, res) {
    function LotToSell(heldLot, priceSold, shares) {
        if (typeof shares === undefined) {
            shares = heldLot.quantity;
        }
        this.account = heldLot.account;
        this.symbol = heldLot.symbol;
        this.quantity = shares;
        this.timeBought = heldLot.created;
        this.priceBought = heldLot.lastTrade;
        this.priceSold = priceSold;
    }
    var request = req;
    var lot = new Lot(req.body);
    if (req.body.orderType === 'buy') {
        if (req.body.priceType === 'market') {
            lot.fillStatus = 'Executed';
        }
        if (req.body.lotType)
        Position.findOne({
            'symbol': request.body.symbol,
            'account': new mongoose.Types.ObjectId(request.body.account),
            'displaySymbol': { '$exists': false }
        }).exec(function(err, position) {
            if (position === null) {
                lot.save(function(err, insertedLot) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        var position = new Position();
                        position.lots = [];
                        position.symbol = request.body.symbol;
                        position.account = new mongoose.Types.ObjectId(request.body.account);
                        position.lots.push(insertedLot._id);
                        position.save();
                        BrokerageAccount.findOne({
                            '_id': position.account
                        }).exec(function(err, account) {
                            account.purchasingPower -= lot.pricePaidWithCommission;
                            account.save();
                        });

                        res.json(lot);
                    }
                });
            } else {
                lot.save(function(err, insertedLot) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        position.lots.push(insertedLot._id);
                        position.save();
                    }
                });

                res.json(lot);
            }
        });
    } else if (req.body.orderType === 'sell') {
        var tempQty = req.body.quantity;
        var i = 0;
        var totalProceeds = 0;
        var transactionTotal = 0;

        Lot.find({
            'symbol': req.body.symbol,
            'fillStatus': 'Executed',
            'lotType': 'stock'
        }).sort({
            _id: -1
        }).exec(function(err, lots) {
            if (lots.length <= 0) {
                res.json({
                    errorMessages: [{
                        type: 'Error',
                        description: 'Not enough quantity to sell.'
                    }]
                });
            } else {
                if (req.body.currentStep === 1) {
                    (function recurse() {
                        totalProceeds += (lots[i].quantity * req.body.lastTrade) - lots[i].pricePaid;
                        tempQty -= lots[i].quantity;
                        if (tempQty > 0) {
                            i++;
                            recurse();
                        }
                    }());

                    res.json({
                        estimatedProceed: totalProceeds
                    });
                }

                if (req.body.currentStep === 2) {
                    (function recurse() {
                        totalProceeds += (lots[i].quantity * req.body.lastTrade) - lots[i].pricePaid;
                        transactionTotal += lots[i].quantity * req.body.lastTrade;
                        if (tempQty >= lots[i].quantity) {
                            //Technically these should both be dependent on one another working properly, and have better error checking...
                            new SoldLot(new LotToSell(lots[i], req.body.lastTrade, lots[i].quantity)).save();
                            lots[i].remove(function(err) {
                                if (err) {
                                    return res.status(400).send({
                                        message: errorHandler.getErrorMessage(err)
                                    });
                                }
                            });
                            Position.update({
                                    'lots': new mongoose.Types.ObjectId(lots[i]._id)
                                }, {
                                    $pull: {
                                        'lots': new mongoose.Types.ObjectId(lots[i]._id)
                                    }
                                },
                                function(err, val) {
                                    console.log(err);
                                }
                            );
                        }

                        if (tempQty < lots[i].quantity) {
                            //TODO: Update the pricePaid so position's gain reflects only remaning shares - Alan
                            //I should probably also handle errors here, but that's a lot of work right now for a prototype.
                            new SoldLot(new LotToSell(lots[i], req.body.lastTrade, tempQty)).save();
                            lots[i].quantity -= tempQty;
                            lots[i].save();
                        }

                        tempQty -= lots[i].quantity;
                        if (tempQty > 0) {
                            i++;
                            recurse();
                        }
                    }());

                    BrokerageAccount.findOne({
                        '_id': new mongoose.Types.ObjectId(request.body.account)
                    }).exec(function(err, account) {
                        account.purchasingPower += transactionTotal;
                        account.save();
                    });

                    res.json({
                        transactionTotal: transactionTotal,
                        totalProceeds: totalProceeds
                    });
                }
            }
        });
    }
};

exports.createOption = function(req, res) {
    var request = req;
    var lot = new Lot(req.body);
    lot.legs = req.body.optionData.legs;
    Position.findOne({
        'symbol': request.body.symbol,
        'account': new mongoose.Types.ObjectId(request.body.account)
    }).exec(function(err, position) {
        lot.save(function(err, insertedLot) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                var position = new Position();
                position.lots = [];
                position.symbol = request.body.symbol;
                position.displaySymbol = request.body.displaySymbol;
                position.account = new mongoose.Types.ObjectId(request.body.account);
                position.lots.push(insertedLot._id);
                position.save();

                BrokerageAccount.findOne({
                    '_id': position.account
                }).exec(function(err, account) {
                    account.purchasingPower -= lot.pricePaidWithCommission;
                    account.save();
                });

                res.json(lot);
            }
        });
    });
};

exports.createMutualFund = function(req, res) {
    var request = req;
    var lot = new Lot(req.body);
    if (req.body.orderType === 'buy') {
        Position.findOne({
            'symbol': request.body.symbol,
            'account': new mongoose.Types.ObjectId(request.body.account)
        }).exec(function(err, position) {
            if (position === null) {
                lot.save(function(err, insertedLot) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        var position = new Position();
                        position.lots = [];
                        position.symbol = request.body.symbol;
                        position.account = new mongoose.Types.ObjectId(request.body.account);
                        position.lots.push(insertedLot._id);
                        position.save();

                        BrokerageAccount.findOne({
                            '_id': position.account
                        }).exec(function(err, account) {
                            account.purchasingPower -= lot.investmentAmount;
                            account.save();
                        });

                        res.json(lot);
                    }
                });
            } else {
                lot.save(function(err, insertedLot) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        position.lots.push(insertedLot._id);
                        position.save();
                    }
                });

                res.json(lot);
            }
        });
    }
};

exports.indexmf = function(req, res) {
    async.parallel({
        mutualFunds: function(callback) {
            Lot.find({
                'account': new mongoose.Types.ObjectId(req.query.accountId),
                'lotType': 'mutual-fund'
            }).lean().exec(function(err, lots) {
                if (lots.length) {
                    var lotsArray = [];
                    lots.forEach(function(lot, index) {
                        lotsArray.push({symbol: lot.symbol, fundFamily: lot.fundFamily});
                    });
                    callback(null, _.uniq(lotsArray, 'symbol'));
                } else {
                    callback(null, {
                        errorMessages: ['No lots for this stock.']
                    });
                }
            });
        }
    }, function(err, results) {
        res.json(results);
    });
};

/**
 * Show the current Trade
 */
exports.read = function(req, res) {

};

/**
 * Update a Trade
 */
exports.update = function(req, res) {

};

/**
 * Delete an Trade
 */
exports.delete = function(req, res) {

};

/**
 * List of Trades
 */
exports.list = function(req, res) {

};
