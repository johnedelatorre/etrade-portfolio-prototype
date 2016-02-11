'use strict';

//Setting up route
angular.module('transactions').config(['$stateProvider',
	function($stateProvider) {
		// Transactions state routing
		$stateProvider.
		state('listTransactions', {
			url: '/transactions',
			templateUrl: 'modules/transactions/views/list-transactions.client.view.html'
		}).state('createTransaction', {
      url: '/transactions/create',
      templateUrl: 'modules/transactions/views/create-transactions.client.view.html'
    });
	}
]);