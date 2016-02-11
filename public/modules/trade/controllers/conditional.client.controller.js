


'use strict';

angular.module('trade').controller('ConditionalController', ['$scope', 'Trades', '$interval', '$timeout', 'api', '$q', '$stateParams',
    function($scope, Trades, $interval, $timeout, api, $q, $stateParams) {
        // Conditional controller logic
        // ...

        $scope.conditionalTickets = {
            'oneTriggersAll': {
                defaults: [{
                    securityType: 'stock',
                    symbol: '',
                    orderType: 'buy',
                    quantity: '',
                    term: 'good-for-the-day',
                    instruction: 'If the following order executes in full:'
                }, {
                    securityType: 'stock',
                    symbol: '',
                    orderType: 'buy',
                    quantity: '',
                    term: 'good-for-the-day',
                    instruction: 'Then execute the following order(s):'
                }]
            },
            'bracketed': {
                defaults: [{
                    securityType: 'stocks',
                    symbol: '',
                    orderType: 'buy',
                    quantity: '',
                    term: 'good-for-the-day'
                }]
            }
        };
        $scope.transaction.conditional.step = [];
        $scope.calculate.step = [];
        $scope.accountDataForSymbol = [];
        $scope.purchasingPower = {};

        $scope.setTicket = function(condition) {
            switch(condition) {
                case 'one-triggers-all':
                    $scope.ticket = $scope.conditionalTickets.oneTriggersAll.defaults;
                    break;
                case 'bracketed':
                    $scope.ticket = $scope.conditionalTickets.bracketed.defaults;
                    break;
                case 'put-spread':
                    $scope.ticket = '';
                    break;
                case 'covered-call':
                    $scope.ticket = '';
                    break;
                default:
                    $scope.strategy = '';
                    break;
            }
        };

        var searchDelay, interval;
        var searchDelayms = 300;
        var intervalms = 10000;

        $scope.findOne = function(i) {
            Trades.index.get({
                accountId: $scope.accountId,
                symbol: $scope.transaction.conditional.step[i].symbol
            }).$promise.then(function(res) {
                $scope.accountDataForSymbol[i] = res;
                console.log($scope.accountDataForSymbol[i]);
            });
        };

        $scope.loadAccountData = function() {
            Trades.index.get({
                accountId: $scope.accountId
            }).$promise.then(function(res) {
                $scope.accountData = res;
                $scope.openOrdersValue = 0;
                angular.forEach($scope.accountData.openOrders, function(value, index) {
                    if(!isNaN(value.pricePaid)) {
                        $scope.openOrdersValue += value.pricePaid;
                    }
                });
                $q.all([$scope.promises.portfolio]).then(function() {
                    $scope.purchasingPower.beforeOpenOrders = $scope.accountDetails[$scope.accountId].purchasingPower + $scope.openOrdersValue;
                    $scope.purchasingPower.reserve = $scope.accountDetails[$scope.accountId].purchasingPower;
                });
            });
        };

        // Helper scope functions
        $scope.updateSearch = function(i) {
            $timeout.cancel(searchDelay);
            searchDelay = $timeout(function() {
                $scope.stopLiveUpdate();
                $scope.startLiveUpdate(i);
                $scope.getDataForSymbol(i);
            }, searchDelayms);
        };

        $scope.cancelCalculator = function(i) {
            $scope.calculate.dollarAmount = 0;
        };

        $scope.setQuantityFromCalculator = function(i) {
            $scope.transaction.conditional.step[i].shares = Math.floor($scope.calculate.shares);
            $scope.calculate.dollarAmount = 0;
        };

        $scope.getDataForSymbol = function(i) {
            $scope.findOne(i);
        };

        $scope.stopLiveUpdate = function() {
            $interval.cancel(interval);
        };

        $scope.startLiveUpdate = function(i) {
            searchRequest(i);
            // interval = $interval(searchRequest, intervalms);
        };

        function searchRequest(i) {
            $scope.promises.symbolPromise = api.quote($scope.transaction.conditional.step[i].symbol).$promise.then(function(response) {
                return response.QuoteResponse;
            }).then(function(response) {
                // $rootScope.debug = {
                //   enable: true,
                //   content: JSON.stringify(response)
                // }
                $scope.strategyStatus = false;
                $scope.alertMessages = [];
                if (response.QuoteData) {
                    var item = response.QuoteData[0];
                    $scope.transaction.conditional.step[i].symbol = $scope.transaction.conditional.step[i].symbol;
                    $scope.transaction.conditional.step[i].companyName = item.All.companyName;
                    $scope.transaction.conditional.step[i].last = item.All.lastTrade;
                    $scope.transaction.conditional.step[i].changeClose = item.All.changeClose;
                    $scope.transaction.conditional.step[i].changeClosePercentage = item.All.changeClosePercentage;
                    $scope.transaction.conditional.step[i].bid = item.All.bid;
                    $scope.transaction.conditional.step[i].bidSize = item.All.bidSize;
                    $scope.transaction.conditional.step[i].ask = item.All.ask;
                    $scope.transaction.conditional.step[i].askSize = item.All.askSize;
                    $scope.transaction.conditional.step[i].totalVolume = item.All.totalVolume;

                    $scope.transaction.conditional.step[i].performance = {
                        high: item.All.high,
                        low: item.All.low,
                        low52: item.All.low52,
                        high52: item.All.high52,
                        pe: item.All.pe,
                        marketCap: item.All.marketCap,
                        dividend: item.All.dividend,
                        nextEarningDate: item.All.nextEarningDate
                    };
                    $scope.calculateBasis = $scope.transaction.conditional.step[i].last;
                } else {
                    var emptyItem = '--';
                    $scope.transaction.conditional.step[i].symbol = $scope.transaction.conditional.step[i].symbol;
                    $scope.transaction.conditional.step[i].companyName = emptyItem;
                    $scope.transaction.conditional.step[i].last = emptyItem;
                    $scope.transaction.conditional.step[i].changeClose = emptyItem;
                    $scope.transaction.conditional.step[i].changeClosePercentage = emptyItem;
                    $scope.transaction.conditional.step[i].bid = emptyItem;
                    $scope.transaction.conditional.step[i].ask = emptyItem;
                    $scope.transaction.conditional.step[i].totalVolume = emptyItem;

                    angular.forEach(response.Messages.Message, function(value) {
                        $scope.alertMessages.push(value);
                    });
                }

            }).catch(function(e) {
                console.log(e);
            });
        }

        $scope.estimateTotalCost = function() {
            var temp = 0;
            angular.forEach($scope.transaction.conditional.step, function(value, index) {
                if (value.orderType === 'sell') {
                    var estimatedProceed = new Trades.stock({
                        account: $scope.accountId,
                        lotType: value.type,
                        priceType: value.priceType,
                        lastTrade: value.last,
                        orderType: value.orderType,
                        symbol: value.symbol,
                        status: value.status,
                        quantity: value.shares,
                        pricePaid: value.subTotalCost,
                        pricePaidWithCommission: value.totalCost,
                        commission: value.commission,
                        currentStep: $scope.step.current,
                        limitPrice: value.limitPrice
                    });

                    estimatedProceed.$save(function(response) {
                        if (response.errorMessages) {
                            angular.forEach(response.errorMessages, function(value, index) {
                                $scope.alert.messages.push(value);
                            });
                        } else {
                            $scope.transaction.estimatedProceed = response.estimatedProceed;
                        }
                    });
                } else {
                    if (!isNaN(value.shares)) {
                        temp += parseInt(value.shares) * parseFloat(value.last) + parseFloat($scope.transaction.commission);
                    }
                }
            });
            $scope.transaction.estimatedTotalCost = temp;

            $scope.purchasingPowerImpactThisOrder = parseFloat($scope.transaction.estimatedTotalCost) * -1 + parseFloat($scope.transaction.estimatedProceed);

            $scope.purchasingPowerAfterThisOrder = $scope.accountDetails[$scope.accountId].purchasingPower - $scope.transaction.estimatedTotalCost + parseFloat($scope.transaction.estimatedProceed);
        };

        $scope.$watch('transaction.conditional.step', function(newValue, oldValue) {
            angular.forEach($scope.transaction.conditional.step, function(value, index) {
                $scope.$watchCollection('[transaction.conditional.step['+index+'].calculateLast, calculate.dollarAmount]', function() {
                    $scope.calculate.shares = 0;
                    $scope.calculate.shares = parseFloat($scope.calculate.dollarAmount) / parseFloat($scope.transaction.conditional.step[index].last);
                });
            });
        }, true);

        $scope.calculateCost = function() {
            angular.forEach($scope.transaction.conditional.step, function(value, index) {
                if ($scope.transaction.conditional.step[0].priceType === 'market') {
                    value.status = 'Executed';
                } else if ($scope.transaction.conditional.step[0].priceType === 'limit') {
                    value.status = 'Open';
                }
                value.instruction = $scope.ticket[index].instruction;

                value.subTotalCost = value.shares * value.last;
                value.totalCost = value.subTotalCost + $scope.transaction.commission;

                $scope.transaction.subTotalCost += value.subTotalCost;
                $scope.transaction.totalCost += value.totalCost;

                if (value.orderType === 'sell') {
                    var estimatedProceed = new Trades.stock({
                        account: $scope.accountId,
                        lotType: value.type,
                        priceType: value.priceType,
                        lastTrade: value.last,
                        orderType: value.orderType,
                        symbol: value.symbol,
                        status: value.status,
                        quantity: value.shares,
                        pricePaid: value.subTotalCost,
                        pricePaidWithCommission: value.totalCost,
                        commission: value.commission,
                        currentStep: $scope.step.current,
                    });

                    estimatedProceed.$save(function(response) {
                        $scope.transaction.estimatedProceed = response.estimatedProceed;
                    });
                }
            });

            $scope.step.current = 2;
        };

        $scope.createStock = function() {
            angular.forEach($scope.transaction.conditional.step, function(value, index) {
                var trade = new Trades.stock({
                    account: $scope.accountId,
                    lotType: value.type,
                    priceType: value.priceType,
                    lastTrade: value.last,
                    orderType: value.orderType,
                    symbol: value.symbol,
                    term: value.term,
                    bid: value.bid,
                    ask: value.ask,
                    fillStatus: value.status,
                    quantity: value.shares,
                    pricePaid: value.subTotalCost,
                    pricePaidWithCommission: value.totalCost,
                    commission: value.commission,
                    currentStep: $scope.step.current,
                    limitPrice: value.limitPrice
                });

                trade.$save(function(response) {
                    $scope.step.current = 3;
                    $scope.response = response;
                });
            });
        };

        $scope.$on('conditional.type', function(event, condition) {
            $scope.setTicket(condition);
            $scope.transaction.conditional.type = condition;
        });
    }
]);
