'use strict';

angular.module('core').directive('sortableTable', [
	function() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				// Sortable table directive logic
				// ...
			},
			scope:true,
			controller: function($scope){
				$scope.reverse = false;
				$scope.sortBy = '_id';
			}
		};
	}
])
	.directive('sortColumn',[
		function(){
			return{
				restruct: 'A',
				require: '^sortableTable',
				link: function($scope, $element, $attrs){
					if($attrs.sortColumn === $scope.sortBy){
						$element.addClass('active');
					}
					//For CSS styles
					$element.attr('ng-Click','');

					$element.bind('click',function(e){

						//This line should probably be refactored to not require jQuery, maybe be based on the DOM
						$element.siblings().removeClass('active');

						//The actual intent of this function
						$element.addClass('active');

						//This is a little bit of a hack because the ng-repeat most of the columns are in creates a new scope
						var whichScope;
						if($attrs.sortColumn === '_id'){
							whichScope = $scope;
						} else {
							whichScope = $scope.$parent;
						}

						if($scope.sortBy === $attrs.sortColumn){
							whichScope.reverse = !whichScope.reverse;
						} else {
							whichScope.sortBy = $attrs.sortColumn;
						}

						$element.toggleClass('reverse',$scope.reverse);
						//Because we're outside the digest cycle. Can be seen by logging $scope.$$phase
						$scope.$apply();
					});
				}
			};
		}
	]);