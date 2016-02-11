'use strict';

angular.module('portfolio').directive('dropdownTradeBtn', [
	function() {
		return {
			templateUrl: '/modules/portfolio/directives/dropdown-trade-btn.client.view.html',
			restrict: 'E',
			replace: true,
			scope:{
				lotType: '='
			}
		};
	}
]);