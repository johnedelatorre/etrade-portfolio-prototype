'use strict';

angular.module('portfolio').controller('OpenOrdersModalController', ['$scope','$filter',
	function($scope,$filter) {
		$scope.openOrdersFor = function(symbol){
			return $filter('filter')($scope.openOrders[$scope.accountId],symbol);
			// order in openOrders[accountId] | filter:{symbol:filters.openOrders}
		};
	}
]);