'use strict';

angular.module('transactions').factory('Transactions', ['$resource', 
	function($resource) {
		return $resource('transactions/:transactionId', {
			transactionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);