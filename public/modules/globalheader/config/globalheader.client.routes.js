'use strict';

//Setting up route
angular.module('globalheader').config(['$stateProvider',
	function($stateProvider) {
		// Globalheader state routing
		$stateProvider.
		state('globalheader', {
			url: '/global-header',
			templateUrl: 'modules/globalheader/views/globalheader.client.view.html'
		});
	}
]);