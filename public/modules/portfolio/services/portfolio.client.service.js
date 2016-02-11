'use strict';

angular.module('portfolio').factory('Portfolio', ['$resource',
	function($resource) {
		// Portfolio service logic
		// ...
	var options = {};
	var actions = {
	    'query': {url:'accounts/:accountId',method: 'GET', isArray:false},
	    'gains': {url:'gains/:accountId', method:'GET', isArray:true}
	};

		// Public API
	return $resource('accounts/:accountId', options, actions);
	}
]);