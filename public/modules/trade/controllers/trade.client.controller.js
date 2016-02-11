'use strict';

angular.module('trade').controller('IndexTradeController', ['$scope', 'api', '$timeout', '$interval', '$rootScope', 'Trades', '$q', 'Portfolio', 'ConditionalTypeService', 'tradeSegue', '$stateParams',
    function($scope, api, $timeout, $interval, $rootScope, Trades, $q, Portfolio, ConditionalTypeService, tradeSegue, $stateParams) {
        // Controller Logic
        // Local vars
        var tradeInfo = tradeSegue.get();
        var searchDelay, interval;
        var searchDelayms = 300;
        var intervalms = 10000;
        $scope.promises = {};
        $scope.promises.optionChain = [];
        $scope.promises.optionStrikePricesPromises = [];
        $scope.api = {};
        $scope.toggles = {};
        // Scope vars
        $scope.transaction = {};
        $scope.accountDetails = {};
        $scope.purchasingPower = {};
        $scope.transaction.commission = 9.99;
        $scope.transaction.status = 'Open';
        $scope.transaction.symbol = '';
        $scope.transaction.conditional = {};
        $scope.performance = {};
        $scope.alert = {};
        $scope.alert.messages = [];
        $scope.tempOptionsData = {};
        $scope.utils = {};
        $scope.step = {};
        $scope.calculate = {};
        $scope.calculate.dollarAmount = 0;
        $scope.strategyStatus = true;
        $scope.conditionalStrategyInfo = false;
        $scope.transaction.type = $stateParams.type || 'stock';
        $scope.transaction.conditional.type = $stateParams.ticket || 'bracketed';
        $scope.setConditionalStrategyInfo = function() {
            $scope.conditionalStrategyInfo = true;
        };

        $scope.toggles.toggleLotSelector = function() {
            $scope.toggleLotSelector = !$scope.toggleLotSelector;
        };

        // Restful scope functions

        $scope.createStock = function() {
            if ($scope.transaction.priceType === 'market') {
                $scope.transaction.status = 'Executed';
            }
            var trade = new Trades.stock({
                account: $scope.accountId,
                lotType: this.transaction.type,
                priceType: this.transaction.priceType,
                lastTrade: this.transaction.last,
                orderType: this.transaction.orderType,
                symbol: this.transaction.symbol,
                term: this.transaction.term,
                bid: this.transaction.bid,
                ask: this.transaction.ask,
                fillStatus: this.transaction.status,
                quantity: this.transaction.shares,
                pricePaid: this.transaction.subTotalCost,
                pricePaidWithCommission: this.transaction.totalCost,
                commission: this.transaction.commission,
                limitPrice: this.transaction.limitPrice,
                currentStep: this.step.current
            });
            trade.$save(function(response) {
                $scope.step.current = 3;
                $scope.response = response;
            });
        };

        $scope.findOne = function() {
            Trades.index.get({
                accountId: $scope.accountId,
                symbol: $scope.transaction.symbol
            }).$promise.then(function(res) {
                $scope.accountDataForSymbol = res;
                console.log($scope.accountDataForSymbol);
            });
        };

        // Helper scope functions
        $scope.updateSearch = function() {
            $scope.transaction.companyName = '';
            $timeout.cancel(searchDelay);
            searchDelay = $timeout(function() {
                $scope.stopLiveUpdate();
                $scope.startLiveUpdate();
                $scope.getDataForSymbol();

                $scope.promises.optionExpireDatePromise = api.optionExpireDate($scope.transaction.symbol).$promise.then(function(response) {
                    return response.OptionExpireDateResponse.ExpirationDate;
                }).then(function(res){
                    $scope.tempOptionsData.expirationDates = res;
                    $scope.api.getOptionChains($scope.tempOptionsData.expirationDates[0]);
                }).catch(function(e) {
                    console.log(e);
                });

            }, searchDelayms);
        };

        $scope.getDataForSymbol = function() {
            $scope.findOne();
        };

        $scope.stopLiveUpdate = function() {
            $interval.cancel(interval);
        };

        $scope.startLiveUpdate = function() {
            searchRequest();
            // interval = $interval(searchRequest, intervalms);
        };

        $scope.estimateTotalCost = function() {
            $scope.estimatedTotalCost = $scope.transaction.shares * $scope.transaction.last + $scope.transaction.commission;
            $scope.purchasingPowerImpactThisOrder = $scope.estimatedTotalCost;
            $scope.purchasingPowerAfterThisOrder = $scope.accountDetails[$scope.accountId].purchasingPower - $scope.estimatedTotalCost;
        };

        $scope.calculateCost = function(goToNextStep) {
            $scope.transaction.subTotalCost = $scope.transaction.shares * $scope.transaction.last;
            $scope.transaction.totalCost = $scope.transaction.subTotalCost + $scope.transaction.commission;

            if ($scope.transaction.orderType === 'sell') {
                var estimatedProceed = new Trades.stock({
                    account: $scope.accountId,
                    lotType: this.transaction.type,
                    priceType: this.transaction.priceType,
                    lastTrade: this.transaction.last,
                    orderType: this.transaction.orderType,
                    symbol: this.transaction.symbol,
                    status: this.transaction.status,
                    quantity: this.transaction.shares,
                    pricePaid: this.transaction.subTotalCost,
                    pricePaidWithCommission: this.transaction.totalCost,
                    commission: this.transaction.commission,
                    currentStep: this.step.current
                });

                estimatedProceed.$save(function(response) {
                    $scope.transaction.estimatedProceed = response.estimatedProceed;

                    if (goToNextStep === true) {
                        $scope.step.current = 2;
                    }
                });
            } else {
                $scope.step.current = 2;
            }
        };

        $scope.cancelCalculator = function() {
            $scope.calculate.dollarAmount = 1000;
        };

        $scope.setQuantityFromCalculator = function() {
            $scope.transaction.shares = Math.floor($scope.calculate.shares);
            $scope.calculate.dollarAmount = 1000;
        };

        $scope.utils.loadAccountData = function() {
            $scope.promises.indices = api.quote('DJIND,COMP.IDX,SPX').$promise.then(function(response) {
                return response.QuoteResponse.QuoteData;
            }).then(function(response) {
                $scope.performance.indices = response;
            });

            Trades.index.get({
                accountId: $scope.accountId
            }).$promise.then(function(res) {
                $scope.accountData = res;
                $q.all([$scope.promises.portfolio]).then(function() {
                    $scope.openOrdersValue = 0;

                    $scope.purchasingPower.beforeOpenOrders = parseFloat($scope.accountDetails[$scope.accountId].purchasingPower) + parseFloat($scope.openOrdersValue);

                    $scope.purchasingPower.reserve = $scope.accountDetails[$scope.accountId].purchasingPower;
                });
            });
        };

        $scope.utils.removeDecimal = function() {
            $scope.transaction.shares = parseInt($scope.transaction.shares);
        };

        $scope.utils.upperCase = function(index) {
            if (index >= 0) {
                $scope.transaction.conditional.step[index].symbol = $scope.transaction.conditional.step[index].symbol.toUpperCase();
            } else {
                $scope.transaction.symbol = $scope.transaction.symbol.toUpperCase();
                $scope.transaction.tempSymbol = $scope.transaction.tempSymbol.toUpperCase();
            }
        };

        // Local functions
        function searchRequest() {
            $scope.promises.symbolPromise = api.quote($scope.transaction.symbol).$promise.then(function(response) {
                return response.QuoteResponse;
            }).then(function(response) {
                // $rootScope.debug = {
                //   enable: true,
                //   content: JSON.stringify(response)
                // }
                $scope.strategyStatus = false;
                $scope.alert.messages = [];
                if (response.QuoteData) {
                    var item = response.QuoteData[0];
                    $scope.transaction.symbol = $scope.transaction.symbol;
                    $scope.transaction.companyName = item.All.companyName;
                    $scope.transaction.last = item.All.lastTrade;
                    $scope.transaction.changeClose = item.All.changeClose;
                    $scope.transaction.changeClosePercentage = item.All.changeClosePercentage;
                    $scope.transaction.bid = item.All.bid;
                    $scope.transaction.bidSize = item.All.bidSize;
                    $scope.transaction.ask = item.All.ask;
                    $scope.transaction.askSize = item.All.askSize;
                    $scope.transaction.totalVolume = item.All.totalVolume;

                    $scope.performance = {
                        high: item.All.high,
                        low: item.All.low,
                        low52: item.All.low52,
                        high52: item.All.high52,
                        pe: item.All.pe,
                        marketCap: item.All.marketCap,
                        dividend: item.All.dividend,
                        nextEarningDate: item.All.nextEarningDate
                    };
                    $scope.calculateBasis = $scope.transaction.last;
                } else {
                    var emptyItem = '--';
                    $scope.transaction.symbol = $scope.transaction.symbol;
                    $scope.transaction.companyName = emptyItem;
                    $scope.transaction.last = emptyItem;
                    $scope.transaction.changeClose = emptyItem;
                    $scope.transaction.changeClosePercentage = emptyItem;
                    $scope.transaction.bid = emptyItem;
                    $scope.transaction.ask = emptyItem;
                    $scope.transaction.totalVolume = emptyItem;

                    angular.forEach(response.Messages.Message, function(value) {
                        $scope.alert.messages.push(value);
                    });
                }

            }).catch(function(e) {
                console.log(e);
            });
        }

        $scope.clearItems = function() {
            var emptyItem = '--';
            $scope.transaction.symbol = '';
            $scope.transaction.companyName = '';
            $scope.transaction.last = emptyItem;
            $scope.transaction.changeClose = emptyItem;
            $scope.transaction.changeClosePercentage = emptyItem;
            $scope.transaction.bid = emptyItem;
            $scope.transaction.ask = emptyItem;
            $scope.transaction.totalVolume = emptyItem;
            $scope.transaction.shares = '';
        };

        $scope.applyConditionalStrategy = function() {
            $scope.transaction.conditional.type = $scope.transaction.conditional.tempType;
        };

        $scope.api.getOptionChains = function(dateObj) {
            // console.log(dateObj);
            $scope.tempOptionsData.optionChain = [];
            $scope.promises.optionChain = api.optionChain({symbol: $scope.transaction.symbol, expiryDay: dateObj.day, expiryMonth: dateObj.month, expiryYear: dateObj.year, includeWeekly: true, skipAdjusted: true}).$promise.then(function(response) {
                $scope.tempOptionsData.optionChain = {'OptionChainResponse': response.OptionChainResponse, 'expiry': new Date(dateObj.year, dateObj.month, dateObj.day)};
            }).catch(function(e) {
                console.log(e);
            });
        };

        $scope.utils.newTrade = function() {
            $scope.step.current = 1;
            $scope.transaction = {};
            $scope.transaction.purchasingPower = {};
            $scope.transaction.commission = 9.99;
            $scope.transaction.status = 'Open';
            $scope.transaction.symbol = '';
            $scope.transaction.conditional = {};
            $scope.transaction.type = 'stock';
            $scope.transaction.conditional.type = 'bracketed';
        };

        function buildMiniChain() {
            var array = [];
            var strikeArray = [];
            var min = -3, max = 3;
            api.optionChain({symbol: $scope.transaction.symbol}).$promise.then(function(response){
                angular.forEach(response.OptionChainResponse.OptionPair, function(value){
                    strikeArray.push(value.Call.strikePrice);
                });
                var closestStrikePriceIndex = closest($scope.transaction.last, strikeArray).currIndex;
            });
        }

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

        // Scope watchers
        $scope.$watchCollection('[transaction.last, calculate.dollarAmount]', function() {
            $scope.calculate.shares = parseFloat($scope.calculate.dollarAmount / $scope.transaction.last).toFixed(2);
        });

        $scope.$watch('transaction.conditional.type', function() {
            ConditionalTypeService.prepForBroadcast($scope.transaction.conditional.type);
        });

        // Scope listeners
        $scope.$on('account.handleAccountId', function(event, accounts, accountId) {
            if (accountId) {
                $scope.accountId = accountId;
                $scope.accounts = accounts;
            } else {
                $scope.accountId = accounts[0]._id;
            }

            $scope.promises.portfolio = Portfolio.query({
                accountId: $scope.accountId
            }).$promise.then(function(res) {
                $scope.accountDetails[$scope.accountId] = res.summary;
            }).catch(function(e) {
                console.log(e);
            });

            Trades.index.get({
                accountId: $scope.accountId
            }).$promise.then(function(res) {
                $scope.accountData = res;
            });
        });

        if (!angular.equals({}, tradeInfo)) {
            $scope.transaction.symbol = tradeInfo._id;
            if (tradeInfo.orderType === 'sell') {
                $scope.transaction.shares = tradeInfo.quantity;
            }
            searchRequest();
            $q.all([$scope.promises.symbolPromise]).then(function() {
                $scope.transaction.orderType = tradeInfo.orderType;
                $scope.estimatedTotalCost = $scope.transaction.shares * $scope.transaction.last + $scope.transaction.commission;
                $scope.getDataForSymbol();
            });
        }
    }
]);
