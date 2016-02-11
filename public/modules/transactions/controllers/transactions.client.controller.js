'use strict';

angular.module('transactions').controller('TransactionsController', ['$scope', '$stateParams', 'api', 'Transactions',
	function($scope, $stateParams, api, Transactions) {
		// Transactions controller logic
		// ...
    // api.quote('GOOG').$promise.then(function(res){
    //   var arr = [];
    //   angular.forEach(res.QuoteResponse.QuoteData, function(value) {
    //     arr.push({ 'symbol': value.Product.symbol, 'lastTrade': value.All.lastTrade });
    //   });
    //   return arr;
    // }).then(function(arr) {
    //   var transaction = new Transactions({
    //     symbol: arr[0].symbol,
    //     lastTrade: arr[0].lastTrade
    //   });
    //   transaction.$save();
    // }).catch(function(e) {
    //   console.log(e);
    // });

        $scope.find = function() {
          $scope.transactions = Transactions.query();
          // console.log(Transactions.query());
        };
	}
]);