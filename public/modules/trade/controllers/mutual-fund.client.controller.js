'use strict';

angular.module('trade').controller('MutualFundController', ['$scope', 'api', '$timeout', '$interval', 'moment', 'Trades',
    function($scope, api, $timeout, $interval, moment, Trades) {
        // Mutual fund controller logic
        // ...
        var searchDelay, interval;
        var searchDelayms = 300;
        var intervalms = 10000;
        $scope.transaction.priceType = 'mutual-fund';
        $scope.transaction.reinvestment = 'Reinvest in Fund';
        $scope.transaction.tempSymbol = '';

        $scope.updateSearch = function() {
            $timeout.cancel(searchDelay);
            searchDelay = $timeout(function() {
                $scope.stopLiveUpdate();
                $scope.startLiveUpdate();
                $scope.getDataForSymbol();
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

        $scope.grabMutualFundList = function() {
            Trades.mutualfund.get({
                accountId: $scope.accountId,
                lotType: $scope.transaction.type
            }).$promise.then(function(res) {
                $scope.mutualFunds = res.mutualFunds;
            });
        };

        $scope.findOne = function() {
            Trades.index.get({
                accountId: $scope.accountId,
                symbol: $scope.transaction.symbol
            }).$promise.then(function(res) {
                $scope.accountDataForSymbol = res;
                $scope.openOrdersValue = 0;
                angular.forEach($scope.accountDataForSymbol.openOrders, function(value, index) {
                    $scope.openOrdersValue += value.pricePaid;
                });
                $scope.purchasingPower.beforeOpenOrders = $scope.accountDetails[$scope.accountId].purchasingPower + $scope.openOrdersValue;
                $scope.purchasingPower.reserve = $scope.accountDetails[$scope.accountId].purchasingPower;
            });
        };

        $scope.estimateTotalCost = function() {
            $scope.estimatedTotalCost = parseFloat($scope.transaction.investmentAmount) + $scope.transaction.commission;
            $scope.purchasingPowerImpactThisOrder = $scope.estimatedTotalCost;
            $scope.purchasingPowerAfterThisOrder = $scope.accountDetails[$scope.accountId].purchasingPower - $scope.estimatedTotalCost;
        };

        $scope.whenOrderPrice = function() {
            var closingTime = new Date().setHours(16, 0);
            if (moment(Date.now()).isBefore(moment(closingTime))) {
                $scope.whenOrderPriceText = 'This order will be priced at the time of closing.';
            } else {
                $scope.whenOrderPriceText = 'This order will be priced as of the close of the next business day.';
            }
            $scope.transaction.fauxShares = parseFloat($scope.transaction.investmentAmount) / $scope.transaction.netAssetValue;
        };

        $scope.setSymbolFromInput = function() {
            $scope.transaction.symbol = '';
            $scope.transaction.symbol = $scope.transaction.tempSymbol;
        };

        $scope.setSymbolFromSelect = function() {
            $scope.transaction.symbol = '';
            $scope.transaction.symbol = $scope.transaction.mutualFunds;
        };

        function searchRequest() {
            $scope.promises.symbolPromise = api.mutualFund($scope.transaction.symbol).$promise.then(function(response) {
                return response.QuoteResponse;
            }).then(function(response) {
                // $rootScope.debug = {
                //   enable: true,
                //   content: JSON.stringify(response)
                // }
                // $scope.strategyStatus = false;
                $scope.alert.messages = [];
                if (response.QuoteData) {
                    var item = response.QuoteData[0];
                    $scope.transaction.symbol = $scope.transaction.symbol;
                    $scope.transaction.fundFamily = item.MutualFund.fundFamily;
                    $scope.transaction.initialInvestment = item.MutualFund.initialInvestment;
                    $scope.transaction.subsequentInvestment = item.MutualFund.subsequentInvestment;
                    $scope.transaction.frontEndSalesCharges = item.MutualFund.frontEndSalesCharges;
                    $scope.transaction.orderCutoffTime = moment(item.MutualFund.orderCutoffTime).format('hh:mm A');
                    $scope.transaction.fee = item.MutualFund.transactionFee;
                    $scope.transaction.timeZone = item.timeZone;
                    $scope.transaction.netAssetValue = item.MutualFund.netAssetValue;
                }
            }).catch(function(e) {
                console.log(e);
            });
        }

        $scope.createMutualFund = function() {
            var trade = new Trades.mutualfund({
                account: $scope.accountId,
                lotType: this.transaction.type,
                priceType: this.transaction.priceType,
                netAssetValue: this.transaction.netAssetValue,
                investmentAmount: this.transaction.investmentAmount,
                orderType: this.transaction.orderType,
                symbol: this.transaction.symbol,
                fillStatus: this.transaction.status,
                quantity: this.transaction.shares,
                currentStep: this.step.current,
                fundFamily: this.transaction.fundFamily,
                fauxShares: this.transaction.fauxShares
            });
            trade.$save(function(response) {
                $scope.step.current = 3;
                $scope.response = response;
            });
        };
    }
]);
