'use strict';

angular.module('portfolio').directive('symbolAlerts', ['$popover',
	function($popover) {
		return {
	    template: '<span ng-class="{\'et-icon-bell-alt\':!hasAlerts, \'et-icon-bell\':hasAlerts}" title="Add Alert" bs-popover data-template="/modules/portfolio/views/partials/symbol-alerts.client.view.html" data-placement="bottom-right"></span>',
			restrict: 'EA',
			replace: true,
			controller: function($scope, $element, $attrs) {
                $scope.symbolAlert = $scope.position._id + '-alert';
        		$scope.alerts = JSON.parse(localStorage.getItem($scope.symbolAlert)) || {};
        		$scope.hasAlerts = Object.keys($scope.alerts).length;
                $scope.saveAlerts = function() {

                    	for(var alert in $scope.alerts){
                    		if($scope.alerts[alert] !== null){
		                        localStorage.setItem($scope.symbolAlert, JSON.stringify($scope.alerts));
		                        $scope.hasAlerts = true;
                    			return;
                    		}
                    	}
                        localStorage.removeItem($scope.symbolAlert);
                        $scope.hasAlerts = false;

                };
            }
		};
	}
]);