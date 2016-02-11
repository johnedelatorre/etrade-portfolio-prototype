//Use on elements by passing a scope value to `et-change` attribute, and setting the format of the number using the `type` attribute.
//For example:
//<span et-change="accountDetails[accountId].totalGainDollar" data-type="dollar" ></span>

'use strict';

angular.module('core').directive('etChange', ['$timeout','$filter',
	function(timer,$filter) {
		return {
			restrict: 'A',
			replace: false,
			scope:{
				value:'=etChange',
				type:'=?type'
			},
			controller: function($scope, $element, $attrs) {
				var sign, formattedValue;
				var check = function(){
					sign = $scope.value >= 0 ? '':'-';
					$element.removeClass('pos neg');
					formattedValue = $filter('number')(Math.abs($scope.value), 2);
					//There's probably a better way to do this, but there are a variety of cases that
					//need to be accounted for, especially when using ng-repeat to generate elements that
					//sometimes don't need styling.
					if(!$scope.type){$scope.type='';}
					if($scope.type !== 'none' && $scope.type.search('uncolored') === -1){
						if($scope.value < 0){
							$element.addClass('neg');
						} else if ($scope.value > 0){
							$element.addClass('pos');
						}
					}

					switch($scope.type){
						case 'signed-dollar':
							if($scope.value > 0) sign = '+';
							$element.text(sign + '$' + formattedValue);
							break;
						case 'dollar':
							$element.text(sign + '$' + formattedValue);
							break;
						case 'pairedPercent':
							$element.text('('+ sign + formattedValue +'%)');
							break;
						case 'percent':
							$element.text(sign + formattedValue +'%');
							break;
						case 'number':
							$element.text($filter('number')($scope.value, 2));
							break;
						case 'none':
							$element.text($scope.value);
							break;
						case 'uncolored':
							$element.text($filter('number')($scope.value,2));
							break;
						case 'uncolored dollar':
							$element.text(sign + '$' + formattedValue);
							break;
						default:
							$element.text($filter('number')($scope.value, 2));
					}

				};
				$scope.$watch('value',function(){
					check();
				});
			}
		};
	}
]);
