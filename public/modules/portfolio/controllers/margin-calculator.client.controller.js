'use strict';

angular.module('portfolio').controller('MarginCalculatorController', ['$scope', '$timeout','api', 'Trades',
	function($scope, $timeout, api, Trades) {
	var searchDelay;
	var searchDelayms = 300;
	$scope.utils = {};
	$scope.getDataForSymbol = function(symbol) {
	    $scope.findOne(symbol);
	};
	$scope.findOne = function(symbol) {
	    api.quote(symbol).$promise.then(function(res) {
		$scope.transaction = res.QuoteResponse.QuoteData[0].All;
		console.log($scope.transaction);
	    });
	};

	$scope.updateSearch = function(symbol) {
	    $timeout.cancel(searchDelay);
	    searchDelay = $timeout(function() {
		$scope.getDataForSymbol(symbol);

		// $scope.promises.optionExpireDatePromise = api.optionExpireDate($scope.transaction.symbol).$promise.then(function(response) {
		//     return response.OptionExpireDateResponse.ExpirationDate;
		// }).then(function(res){
		//     $scope.tempOptionsData.expirationDates = res;
		//     $scope.api.getOptionChains($scope.tempOptionsData.expirationDates[0]);
		// }).catch(function(e) {
		//     console.log(e);
		// });

	    }, searchDelayms);
	};
	$scope.utils.upperCase = function() {
	    $scope.transaction.symbol = $scope.transaction.symbol.toUpperCase();
	};
	}
]);