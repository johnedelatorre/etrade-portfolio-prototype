'use strict';

angular.module('trade').filter('monthName', [
	function() {
		return function(input) {
			// Monthname filter logic
			// ...
      var monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
        return monthNames[input - 1];
		};
	}
]);