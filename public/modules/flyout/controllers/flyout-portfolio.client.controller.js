'use strict';
angular.module('flyout').controller('PortfolioController', ['$scope', 'Portfolio', '$http', '$rootScope', '$state', 'api','tradeSegue',
    function($scope, Portfolio, $http, $rootScope, $state, api, tradeSegue) {
        $scope.portfolio = {};
        $scope.accountDetails = {};
        $scope.openOrders = {};
        $scope.reverse = false;
        $scope.portfolioLoaded = false;
        $scope.alert = function(message) {
            window.alert(message);
        };

        //Set some default notes
        if(!localStorage.getItem('returnVisit')){
            ['MSFT','GOOG','P'].forEach(function(symbol){
                localStorage.setItem(symbol+'-note', 'This is a note for '+symbol);
            });
        ['FB','TSLA','PBR'].forEach(function(symbol){
        localStorage.setItem(symbol+'-alert', JSON.stringify({highDollar:100}));
        });
            localStorage.setItem('returnVisit',true);
        }

        $scope.setTradeSegue = tradeSegue.set;


        $scope.clearLocalStorage = function(){
            localStorage.clear();
            console.log('cleared localStorage');
            $state.go($state.current, {}, {reload: true});
        };

        $scope.loadPortfolio = function(accountId) {
            //This only updates portfolio once a promise has been returned, so that data is always there, and then updates when newer data is available.
            $scope.accountId = accountId;
            Portfolio.query({
                accountId: $scope.accountId
            }).$promise.then(function(res) {
                $scope.portfolio[$scope.accountId] = res.positions;
                $scope.accountDetails[$scope.accountId] = res.summary;
                $scope.openOrders[$scope.accountId] = res.open;
                $scope.portfolioLoaded = true;
                $scope.$broadcast('portfolioFetched');
                $scope.portfolioSymbols = res.positions.map(function(position) {
                    return position._id;
                });
                $scope.fetchNews();
                $scope.earnings = api.earnings($scope.portfolioSymbols, {
                    periodType: 'QTR',
                    periodCount: 1
                });
            }).
            catch(function(e) {
                console.log(e);
            });
        };
        $scope.fetchNews = function() {
            api.news('marketwatch', {
                overrideProvider: true,
                count: 9,
                symbol: $scope.portfolioSymbols
            }).$promise.then(function(res) {
                $scope.portfolioNews = res.NewsResponse.News;
            }, function(err) {
                console.log('error fetching news');
                $scope.portfolioNews = [{
                    error: err
                }];
            });
        };

    // $scope.sortBy = function(predicate) {
    //     if ($scope.sort === predicate) {
    //         $scope.reverse = !$scope.reverse;
    //     }
    //     $scope.sort = predicate;
    // };
    $scope.expandedRowsVisible = [];
    //This is slightly hacky, but should cover all the cases for now at least. Checks if the element that's clicked on has an ng-click or href attribute. If it does, don't expand the row.
    $scope.toggleRow = function($event, row) {
        var attributes = $event.originalEvent.target.attributes;
        for (var attribute in attributes) {
        if (attributes[attribute].name === 'ng-click' || attributes[attribute].name === 'href') {
            return;
        }
        }
        $scope.expandedRowsVisible[row] = !$scope.expandedRowsVisible[row];
    };
    $scope.openOrdersForSymbol = function(symbol){
        return $scope.openOrders[$scope.accountId].filter(function(element){
        return element.symbol===symbol;
        });
    };
    $scope.notAHeldSymbol = function(order, index){
        if($scope.portfolioSymbols.indexOf(order.symbol) === -1){
            return true;
        }
    };

        $scope.$on('account.handleAccountId', function(event, accounts, accountId) {
            $scope.loadPortfolio(accountId);
        $scope.accounts = accounts;
        });

    }
]);
