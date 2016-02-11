'use strict';

angular.module('portfolio').controller('TableFooterController', ['$scope',
	function($scope) {
		if($scope.config.allOptions[$scope.column].summable === true){
			$scope.visibleSumForColumn = 'visible'+$scope.column;
			if($scope.column === 'value'){
				$scope.type = 'uncolored';
			}
		}
	}
]);