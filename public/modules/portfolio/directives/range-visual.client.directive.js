'use strict';

angular.module('portfolio').directive('rangeVisual', [
	function() {
		return {
			template: '<div class="range-slider"><div class="pull-left label">{{min | number:2}}</div><span class="range-indicator" style="left: {{percent}}%;">&nbsp;</span><div class="pull-right label">{{max | number: 2}}</div></div>',
			restrict: 'E',
			scope:{
				min: '=',
				max: '=',
				current: '='
			},
			replace: true,
			link: function postLink(scope, element, attrs) {
				// Range visual directive logic
				// ...
				scope.percent = (scope.current-scope.min)/(scope.max-scope.min)*100;
				// element.text('this is the rangeVisual directive');
			}
		};
	}
]);