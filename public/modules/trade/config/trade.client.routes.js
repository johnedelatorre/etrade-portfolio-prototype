'use strict';

//Setting up route
angular.module('trade').config(['$stateProvider',
	function($stateProvider) {
		// Trade state routing
		$stateProvider.
		state('trade', {
			url: '/trade?type&ticket',
			templateUrl: 'modules/trade/views/index-trade.client.view.html'
		});
	}
]);