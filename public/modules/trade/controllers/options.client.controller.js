'use strict';

angular.module('trade').controller('OptionsController', ['$scope', 'api', '$q', '$location', '$anchorScroll', '$filter', 'Trades',
    function($scope, api, $q, $location, $anchorScroll, $filter, Trades) {
        // Options controller logic
        // Local vars

        // Scope vars
        $scope.optionData = {};
        $scope.optionData.legs = [];
        $scope.strategy = {};
        $scope.strategy.defaults = [];
        $scope.selectedLeg = false;
        $scope.strategyInfo = false;
        $scope.activeExpiry = 0;
        $scope.enableShowStrategyInfo = false;
        $scope.fullChainEnable = false;
        $scope.transaction.call = {};
        $scope.transaction.put = {};
        $scope.setActiveExpiryClass = function(index) {
            $scope.activeExpiry = index;
        };

        $scope.setActiveStrategy = function() {
            $scope.strategy = '';
            switch ($scope.transaction.strategy) {
                case 'basic':
                    $scope.strategy = $scope.strategies.basic;
                    break;
                case 'call-spread':
                    $scope.strategy = $scope.strategies.callSpread;
                    break;
                case 'put-spread':
                    $scope.strategy = $scope.strategies.putSpread;
                    break;
                case 'covered-call':
                    $scope.strategy = $scope.strategies.coveredCall;
                    break;
                case 'married-put':
                    $scope.strategy = $scope.strategies.marriedPut;
                    break;
                case 'collars':
                    $scope.strategy = $scope.strategies.collars;
                    break;
                case 'straddle':
                    $scope.strategy = $scope.strategies.straddle;
                    break;
                case 'strangle':
                    $scope.strategy = $scope.strategies.strangle;
                    break;
                case 'calendar':
                    $scope.strategy = $scope.strategies.calendar;
                    break;
                case 'diagonal':
                    $scope.strategy = $scope.strategies.diagonal;
                    break;
                case 'butterfly':
                    $scope.strategy = $scope.strategies.butterfly;
                    break;
                case 'iron-butterfly':
                    $scope.strategy = $scope.strategies.ironButterfly;
                    break;
                case 'condor':
                    $scope.strategy = $scope.strategies.condor;
                    break;
                case 'iron-condor':
                    $scope.strategy = $scope.strategies.ironCondor;
                    break;
                default:
                    $scope.strategy = '';
                    break;
            }
        };
        $scope.strategies = {
            basic: {
                defaults: [{
                    orderType: 'buy-open',
                    contracts: 1,
                    legType: 'call',
                    expiration: 0, // need to make a call to the API to retrieve this (TTT defaults to first expiration)
                    strike: 0 // need to make a call to the API to retrieve this (this may tie into the mini-chain)
                }],
                // components, buy/sell restriction, quantity restriction, expiration restriction, strike restriction
                check: []
            },
            callSpread: {
                defaults: [{
                    orderType: 'buy-open', // buy one, sell the other
                    contracts: 1, // must be the same as the other
                    legType: 'call',
                    expiration: 0, // must be the same as the other
                    strike: 0 // must be different from the other
                }, {
                    orderType: 'sell-open', // buy one, sell the other
                    contracts: 1,  // must be the same as the other
                    legType: 'call',
                    expiration: 0, // must be the same as the other
                    strike: 1 // must be different from the other
                }],
                check: []
            },
            putSpread: {
                defaults: [{
                    orderType: 'buy-open', // buy one, sell the other
                    contracts: 1, // must be the same as the other
                    legType: 'put',
                    expiration: 0, // must be the same as the other
                    strike: 0 // must be different from the other
                }, {
                    orderType: 'sell-open', // buy one, sell the other
                    contracts: 1,  // must be the same as the other
                    legType: 'put',
                    expiration: 0, // must be the same as the other
                    strike: 1 // must be different from the other
                }],
                check: []
            },
            straddle: {
                defaults: [{
                    orderType: 'buy-open', // buy both or sell both
                    contracts: '', // must be the same as the other
                    legType: 'call',
                    expiration: '', // must be the  same as the other
                    strike: '' // must be same as the other
                }, {
                    orderType: 'buy-open', // buy both or sell both
                    contracts: '', // must be the same as the other
                    legType: 'put',
                    expiration: '', // must be the  same as the other
                    strike: '' // must be same as the other
                }],
                check: []
            },
            strangle: {
                defaults: [{
                    orderType: 'buy-open', // buy both or sell both
                    contracts: '', // must be the same as the other
                    legType: 'call',
                    expiration: '', // must be the  same as the other
                    strike: '' // must be different from the other
                }, {
                    orderType: 'buy-open', // buy both or sell both
                    contracts: '', // must be the same as the other
                    legType: 'put',
                    expiration: '', // must be the  same as the other
                    strike: '' // must be different from the other
                }],
                check: []
            },
            combo: {
                defaults: [{
                    orderType: 'buy-open', // buy both or sell both
                    contracts: '', // must be the same as the other
                    legType: 'call',
                    expiration: '', // must be the  same as the other
                    strike: '' // must be different from the other
                }, {
                    orderType: 'sell-open', // buy both or sell both
                    contracts: '', // must be the same as the other
                    legType: 'put',
                    expiration: '', // must be the  same as the other
                    strike: '' // must be different from the other
                }],
                check: []
            },
            calendar: {
                defaults: [{
                    orderType: 'buy-open', // buy one, sell other
                    contracts: '', // must be the same as the other
                    legType: 'call', // 2 calls or 2 puts
                    expiration: '', // must be the different from the other
                    strike: '' // must be same as the other
                }, {
                    orderType: 'sell-open', // buy one, sell other
                    contracts: '', // must be the same as the other
                    legType: 'call', // 2 calls or 2 puts
                    expiration: '', // must be the different from the other
                    strike: '' // must be same as the other
                }],
                check: []
            },
            diagonal: {
                defaults: [{
                    orderType: 'buy-open', // buy one, sell other
                    contracts: '', // must be the same as the other
                    legType: 'call', // 2 calls or 2 puts
                    expiration: '', // must be the different from the other
                    strike: '' // must be different from the other
                }, {
                    orderType: 'sell-open', // buy one, sell other
                    contracts: '', // must be the same as the other
                    legType: 'call', // 2 calls or 2 puts
                    expiration: '', // must be the different from the other
                    strike: '' // must be different from the other
                }],
                check: []
            },
            butterfly: {
                defaults: [{
                    orderType: 'buy-open', // buy, sell, buy or sell, buy, sell
                    contracts: '', // must be 1:2:1 ratio
                    legType: 'call', // 3 calls or 3 puts
                    expiration: '', // must be the same as the other
                    strike: '' // must be 3 equidistant strikes
                }, {
                    orderType: 'sell-open', // buy, sell, buy or sell, buy, sell
                    contracts: '', // must be 1:2:1 ratio
                    legType: 'call', // 3 calls or 3 puts
                    expiration: '', // must be the same as the other
                    strike: '' // must be 3 equidistant strikes
                }, {
                    orderType: 'buy-open', // buy, sell, buy or sell, buy, sell
                    contracts: '', // must be 1:2:1 ratio
                    legType: 'call', // 3 calls or 3 puts
                    expiration: '', // must be the same as the other
                    strike: '' // must be 3 equidistant strikes
                }],
                check: []
            },
            condor: {
                defaults: [{
                    orderType: 'buy-open', // buy, sell, sell, buy or sell, buy, buy, sell
                    contracts: '', // must be same quantity
                    legType: 'call', // 4 calls or 4 puts
                    expiration: '', // must be the same as the other
                    strike: '' // must be 4 different strikes where strike 2 - strike 1 = strike 4 - strike 3
                }, {
                    orderType: 'sell-open', // buy, sell, sell, buy or sell, buy, buy, sell
                    contracts: '', // must be same quantity
                    legType: 'call', // 4 calls or 4 puts
                    expiration: '', // must be the same as the other
                    strike: '' // must be 4 different strikes where strike 2 - strike 1 = strike 4 - strike 3
                }, {
                    orderType: 'sell-open', // buy, sell, sell, buy or sell, buy, buy, sell
                    contracts: '', // must be same quantity
                    legType: 'call', // 4 calls or 4 puts
                    expiration: '', // must be the same as the other
                    strike: '' // must be 4 different strikes where strike 2 - strike 1 = strike 4 - strike 3
                }, {
                    orderType: 'buy-open', // buy, sell, sell, buy or sell, buy, buy, sell
                    contracts: '', // must be same quantity
                    legType: 'call', // 4 calls or 4 puts
                    expiration: '', // must be the same as the other
                    strike: '' // must be 4 different strikes where strike 2 - strike 1 = strike 4 - strike 3
                }],
                check: []
            },
            ironButterfly: {
                defaults: [{
                    orderType: 'buy-open', // buy, sell, sell, buy or sell, buy, buy, sell
                    contracts: 1, // must be same quantity
                    legType: 'call', // 2 calls and 2 puts
                    expiration: 0, // must be the same as the other
                    strike: 0 // must be 3 equidistant strikes; middle two are same strike & 1 call + 1 put
                }, {
                    orderType: 'sell-open', // buy, sell, sell, buy or sell, buy, buy, sell
                    contracts: 1, // must be same quantity
                    legType: 'call', // 2 calls and 2 puts
                    expiration: 0, // must be the same as the other
                    strike: 1 // must be 3 equidistant strikes; middle two are same strike & 1 call + 1 put
                }, {
                    orderType: 'sell-open', // buy, sell, sell, buy or sell, buy, buy, sell
                    contracts: 1, // must be same quantity
                    legType: 'put', // 2 calls and 2 puts
                    expiration: 0, // must be the same as the other
                    strike: 1 // must be 3 equidistant strikes; middle two are same strike & 1 call + 1 put
                }, {
                    orderType: 'buy-open', // buy, sell, sell, buy or sell, buy, buy, sell
                    contracts: 1, // must be same quantity
                    legType: 'put', // 2 calls and 2 puts
                    expiration: 0, // must be the same as the other
                    strike: 2 // must be 3 equidistant strikes; middle two are same strike & 1 call + 1 put
                }],
                check: []
            },
            ironCondor: {
                defaults: [{
                    orderType: 'buy-open', // buy, sell, sell, buy or sell, buy, buy, sell
                    contracts: '', // must be same quantity
                    legType: 'call', // 2 calls and 2 puts
                    expiration: '', // must be the same as the other
                    strike: '' // two lowest strikes are both calls or both puts & must be 4 different strikes where strike 2 - strike 1 = strike 4 - strike 3
                }, {
                    orderType: 'sell-open', // buy, sell, sell, buy or sell, buy, buy, sell
                    contracts: '', // must be same quantity
                    legType: 'call', // 2 calls and 2 puts
                    expiration: '', // must be the same as the other
                    strike: '' // two lowest strikes are both calls or both puts & must be 4 different strikes where strike 2 - strike 1 = strike 4 - strike 3
                }, {
                    orderType: 'sell-open', // buy, sell, sell, buy or sell, buy, buy, sell
                    contracts: '', // must be same quantity
                    legType: 'put', // 2 calls and 2 puts
                    expiration: '', // must be the same as the other
                    strike: '' // two lowest strikes are both calls or both puts & must be 4 different strikes where strike 2 - strike 1 = strike 4 - strike 3
                }, {
                    orderType: 'buy-open', // buy, sell, sell, buy or sell, buy, buy, sell
                    contracts: '', // must be same quantity
                    legType: 'put', // 2 calls and 2 puts
                    expiration: '', // must be the same as the other
                    strike: '' // two lowest strikes are both calls or both puts & must be 4 different strikes where strike 2 - strike 1 = strike 4 - strike 3
                }],
                check: []
            },
            coveredCall: {
                defaults: [{
                    orderType: 'Buy', // buy one + sell one
                    contracts: '',
                    legType: 'stock',
                    expiration: '',
                    strike: '' // 100 * option
                }, {
                    orderType: 'sell-open', // buy one + sell one
                    contracts: '',
                    legType: 'call',
                    expiration: '',
                    strike: ''
                }],
                check: []
            },
            marriedPut: {
                defaults: [{
                    orderType: 'Buy', // buy both + sell both
                    contracts: '',
                    legType: 'stock',
                    expiration: '',
                    strike: '' // 100 * option
                }, {
                    orderType: 'buy-open', // buy both + sell both
                    contracts: '',
                    legType: 'put',
                    expiration: '',
                    strike: ''
                }],
                check: []
            },
            collar: {
                defaults: [{
                    orderType: 'Buy', // buy stock & put + sell call or sell stock & put, buy call
                    contracts: '',
                    legType: 'stock',
                    expiration: '',
                    strike: '' // 100 * option
                }, {
                    orderType: 'buy-open', // buy both + sell both
                    contracts: '', // option quantity must be the same
                    legType: 'put',
                    expiration: '',
                    strike: ''
                }, {
                    orderType: 'sell-open', // buy one + sell one
                    contracts: '', // option quantity must be the same
                    legType: 'call',
                    expiration: '',
                    strike: ''
                }],
                check: []
            },
            custom: {
                defaults: [],
                check: []
            }
        };

        $scope.setSelectedLeg = function(index) {
            $scope.selectedLeg = true;
            $scope.selectedLegIndex = index;
            $scope.selectedLegStrikePriceIndex = $scope.optionData.legs[index].strikePriceIndex;
            $scope.selectedLegStrikePrice = $scope.tempOptionsData.strikePrices[$scope.selectedLegStrikePriceIndex];
            $scope.selectedLegType = $scope.optionData.legs[index].legType;
            $scope.selectedLegOrderType = $scope.optionData.legs[index].orderType;
        };

        // Restful scope functions
        // Helper scope functions
        // Local functions
        function closest(num, arr) {
            var currVal = arr[0];
            var currIndex;
            var current = {};
            var diff = Math.abs (num - currVal);
            for (var val = 0; val < arr.length; val++) {
                var newdiff = Math.abs (num - arr[val]);
                if (newdiff < diff) {
                    diff = newdiff;
                    current.currVal = arr[val];
                    current.currIndex = val;
                }
            }
            return current;
        }

        function getOptionStrikePrices(i) {
            $scope.promises.optionStrikePricesPromises[i] = api.optionStrikePrices($scope.transaction.symbol, $scope.tempOptionsData.expirationDates[$scope.optionData.legs[i].expiration], $scope.optionData.legs[i].legType).$promise.then(function(response) {
                var strikePricesArr = [];
                if ($scope.optionData.legs[i].legType === 'call') {
                    angular.forEach(response.OptionStrikePricesResponse.OptionPair, function(value) {
                        strikePricesArr.push(value.Call.product.strikePrice);
                    });
                } else {
                    angular.forEach(response.OptionStrikePricesResponse.OptionPair, function(value) {
                        strikePricesArr.push(value.Put.product.strikePrice);
                    });
                }
                return strikePricesArr;
            }).then(function(res) {
                $scope.tempOptionsData.strikePrices = res;

                $scope.tempOptionsData.closestStrikePriceIndex = closest($scope.transaction.last, $scope.tempOptionsData.strikePrices).currIndex;

                $scope.tempOptionsData.closestStrikePrice = closest($scope.transaction.last, $scope.tempOptionsData.strikePrices).currVal;

                $scope.optionData.legs[i].strikePriceIndex = $scope.tempOptionsData.closestStrikePriceIndex + $scope.strategy.defaults[i].strike;
            }).catch(function(e) {
                console.log(e);
            });
        }

        $scope.estimateTotalCost = function() {
            $scope.transaction.optionData = $scope.optionData;
            var optionMultiplier = 100;
            var subTotal = 0;
            var fee = 0;
            var commission = 0;

            $scope.transaction.fee = 0;
            $scope.transaction.commission = 9.99;
            $scope.transaction.subTotalCost = 0;
            $scope.transaction.totalCost = 0;
            $scope.estimatedTotalCost = 0;

            angular.forEach($scope.transaction.optionData.legs, function(value, index) {
                subTotal += (value.contracts * optionMultiplier) * value.relatedStrikeInfo.lastPrice;
                fee += (0.02) * value.contracts;
                commission += ($scope.transaction.commission + 0.75) * value.contracts;
            });

            $scope.transaction.fee = fee;
            $scope.transaction.commission = commission;
            $scope.transaction.subTotalCost = subTotal;
            $scope.transaction.totalCost = $scope.transaction.subTotalCost + $scope.transaction.commission + $scope.transaction.fee;
            $scope.estimatedTotalCost = $scope.transaction.totalCost;

            $scope.purchasingPowerImpactThisOrder = $scope.estimatedTotalCost * -1;
            $scope.purchasingPowerAfterThisOrder = $scope.accountDetails[$scope.accountId].purchasingPower - $scope.estimatedTotalCost;
        };

        $scope.clearHighlights = function() {
            angular.forEach($scope.tempOptionsData.optionChain.OptionChainResponse.OptionPair, function(value, index) {
                if (value.Call.markedAsk !== undefined) {
                    value.Call.markedAsk = false;
                }
                if (value.Call.markedBid !== undefined) {
                    value.Call.markedBid = false;
                }
                if (value.Put.markedAsk !== undefined) {
                    value.Put.markedAsk = false;
                }
                if (value.Put.markedBid !== undefined) {
                    value.Put.markedBid = false;
                }
            });
        };

        $scope.clearMark = function(leg) {
            $scope.tempOptionsData.optionChain.OptionChainResponse.OptionPair[leg.strikePriceIndex].Call.markedAsk = false;
            $scope.tempOptionsData.optionChain.OptionChainResponse.OptionPair[leg.strikePriceIndex].Call.markedBid = false;
            $scope.tempOptionsData.optionChain.OptionChainResponse.OptionPair[leg.strikePriceIndex].Put.markedAsk = false;
            $scope.tempOptionsData.optionChain.OptionChainResponse.OptionPair[leg.strikePriceIndex].Put.markedBid = false;
        };

        $scope.deduceStrikeHighlights = function() {
            var subNetBidBuy = 0;
            var subNetAskBuy = 0;
            var subNetBidSell = 0;
            var subNetAskSell = 0;
            angular.forEach($scope.optionData.legs, function(value, index) {
                if (value.legType === 'call') {
                    value.relatedStrikeInfo = $scope.tempOptionsData.optionChain.OptionChainResponse.OptionPair[value.strikePriceIndex].Call;
                    if (value.orderType === 'buy-open' || value.orderType === 'buy-close') {
                        $scope.tempOptionsData.optionChain.OptionChainResponse.OptionPair[value.strikePriceIndex].Call.markedAsk = true;
                        subNetBidBuy += $scope.tempOptionsData.optionChain.OptionChainResponse.OptionPair[value.strikePriceIndex].Call.bid;
                        subNetAskBuy += $scope.tempOptionsData.optionChain.OptionChainResponse.OptionPair[value.strikePriceIndex].Call.ask;
                    }

                    if (value.orderType === 'sell-open' || value.orderType === 'sell-close') {
                        $scope.tempOptionsData.optionChain.OptionChainResponse.OptionPair[value.strikePriceIndex].Call.markedBid = true;
                        subNetBidSell += $scope.tempOptionsData.optionChain.OptionChainResponse.OptionPair[value.strikePriceIndex].Call.bid;
                        subNetAskSell += $scope.tempOptionsData.optionChain.OptionChainResponse.OptionPair[value.strikePriceIndex].Call.ask;
                    }
                }

                if (value.legType === 'put') {
                    value.relatedStrikeInfo = $scope.tempOptionsData.optionChain.OptionChainResponse.OptionPair[value.strikePriceIndex].Put;
                    if (value.orderType === 'buy-open' || value.orderType === 'buy-close') {
                        $scope.tempOptionsData.optionChain.OptionChainResponse.OptionPair[value.strikePriceIndex].Put.markedAsk = true;
                        subNetBidBuy += $scope.tempOptionsData.optionChain.OptionChainResponse.OptionPair[value.strikePriceIndex].Put.bid;
                        subNetAskBuy += $scope.tempOptionsData.optionChain.OptionChainResponse.OptionPair[value.strikePriceIndex].Put.ask;
                    }

                    if (value.orderType === 'sell-open' || value.orderType === 'sell-close') {
                        $scope.tempOptionsData.optionChain.OptionChainResponse.OptionPair[value.strikePriceIndex].Put.markedBid = true;
                        subNetBidSell += $scope.tempOptionsData.optionChain.OptionChainResponse.OptionPair[value.strikePriceIndex].Put.bid;
                        subNetAskSell += $scope.tempOptionsData.optionChain.OptionChainResponse.OptionPair[value.strikePriceIndex].Put.ask;
                    }
                }
            });

            // Net Bid = [sum of (bid*quantity) for all options you are buying] - [sum of (ask*quantity) for all options you are selling]
            // Net Ask = [sum of (ask*quantity) for all options you are buying] - [sum of (bid*quantity) for all options you are selling]
            $scope.netBid = parseFloat(subNetBidBuy - subNetAskSell).toFixed(2);
            $scope.netAsk = parseFloat(subNetAskBuy - subNetBidSell).toFixed(2);
            $scope.midPoint = parseFloat((parseFloat($scope.netBid) + parseFloat($scope.netAsk)) / 2).toFixed(2);

        };

        $scope.modifyActiveLeg = function(strikePrice, legType, orderType) {
            if ($scope.selectedLeg === true) {
                var strikePriceIndex = 0;
                angular.forEach($scope.tempOptionsData.strikePrices, function(value, index) {
                    if (value === strikePrice) {
                        strikePriceIndex = index;
                    }
                });
                $scope.optionData.legs[$scope.selectedLegIndex].strikePriceIndex = strikePriceIndex;
                $scope.optionData.legs[$scope.selectedLegIndex].legType = legType;
                $scope.optionData.legs[$scope.selectedLegIndex].orderType = orderType;

                $scope.setSelectedLeg($scope.selectedLegIndex);

                $scope.deduceStrikeHighlights();
            } else {
                return;
            }
        };

        $scope.removeLeg = function(index) {
            $scope.optionData.legs.splice(index, 1);
            $scope.strategy.defaults.splice(index, 1);
            // todo: if watchers get unnecessarily large, we should look into unbinding the watchers in the for loop below
        };

        $scope.addLeg = function() {
            $scope.transaction.strategy = 'custom';
            $scope.strategy.defaults.push({
                orderType: 'buy-open',
                contracts: 1,
                legType: 'call',
                expiration: 0,
                strike: 0
            });
            $scope.optionData.legs.push({
                orderType: 'buy-open',
                contracts: 1,
                legType: 'call',
                expiration: 0,
                strike: 0
            });

            $scope.$watch('optionData.legs', function(newValue, oldValue) {
                $q.all([$scope.promises.optionExpireDatePromise, $scope.promises.symbolPromise]).then(function() {
                    getOptionStrikePrices($scope.optionData.legs.length - 1);
                    $q.all($scope.promises.optionStrikePricesPromises).then(function() {
                        for(var i = 0; i < $scope.optionData.legs.length; i++) {
                            avoidJSHintMakeWatch(i);
                        }
                    });
                });
            });
        };

        $scope.moArrayIndex = 0;

        $scope.updateActiveExpiration = function(dateObj) {
            $scope.api.getOptionChains(dateObj);
            $q.all([$scope.promises.optionChain]).then(function() {
                $scope.deduceStrikeHighlights();
            });
        };

        $scope.showFullChain = function() {
            $scope.fullChainEnable = true;
        };

        $scope.hideFullChain = function() {
            $scope.fullChainEnable = false;
            $location.hash('');
        };

        $scope.mergeOptionTransaction = function() {
            // $scope.transaction.optionData = $scope.optionData;
        };

        $scope.calculateCost = function() {
            $scope.step.current = 2;
        };

        $scope.createOption = function() {
            if ($scope.transaction.priceType === 'market') {
                $scope.transaction.status = 'Executed';
            }
            var trade = new Trades.option({
                account: $scope.accountId,
                lotType: this.transaction.type,
                priceType: this.transaction.priceType,
                lastTrade: this.transaction.last,
                orderType: this.transaction.orderType,
                symbol: this.transaction.symbol,
                displaySymbol: this.transaction.optionData.legs[0].relatedStrikeInfo.displaySymbol,
                term: this.transaction.term,
                bid: this.transaction.bid,
                ask: this.transaction.ask,
                fillStatus: this.transaction.status,
                quantity: this.transaction.shares,
                pricePaid: this.transaction.subTotalCost,
                pricePaidWithCommission: this.transaction.totalCost,
                commission: this.transaction.commission,
                fee: this.transaction.fee,
                strategy: this.transaction.strategy,
                optionData: this.transaction.optionData,
                currentStep: this.step.current
            });
            trade.$save(function(response) {
                $scope.step.current = 3;
                $scope.response = response;
            });
        };

        function avoidJSHintMakeWatch(i) {
            $scope.$watch('optionData.legs[' + i + ']', function(newValue, oldValue) {
                $scope.clearMark(oldValue);
                $scope.deduceStrikeHighlights();
                $scope.estimateTotalCost();
            }, true);
        }

        // Scope watchers
        $scope.$watch('strategy.defaults', function() {
            if ($scope.transaction.symbol) {
                $scope.optionData.legs = [];
                $scope.clearHighlights();
                $q.all([$scope.promises.optionExpireDatePromise, $scope.promises.symbolPromise]).then(function() {
                    angular.forEach($scope.optionData.legs, function(value, index) {
                        getOptionStrikePrices(index);
                    });

                    $q.all($scope.promises.optionStrikePricesPromises).then(function() {
                        // good god, i'm sorry but i have to watch each leg for change to update mini/full chain
                        for(var i = 0; i < $scope.optionData.legs.length; i++) {
                            avoidJSHintMakeWatch(i);
                        }
                    });
                });
            }
        });

        // Scope listeners
    }
]);
