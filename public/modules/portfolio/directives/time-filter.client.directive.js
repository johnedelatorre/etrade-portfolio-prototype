'use strict';
//Call this element <time-filter> with 3 attributes: start-date and end-date, with which you pass JS date objects bound to the dates selected within the directive, and optionally ranges which is the dates you want to have by default. Right now it's just years and the default ranges which are weeks/months/year into the future.

angular.module('portfolio').directive('timeFilter', ['moment',
	function(moment) {
		return {
			templateUrl: '/modules/portfolio/directives/time-filter.client.directive.html',
			restrict: 'E',
			replace: true,
			scope:{
				startDate: '=startDate',
				endDate: '=endDate',
				ranges: '=?',
				initialRange: '=?'
			},
			controller: function($scope, $attrs){
				if(!$scope.ranges){
					$scope.ranges = [
						{
							value: '1 week',
							name: '1 week',
							type: 'duration'
						},
						{
							value: '2 weeks',
							name: '2 weeks',
							type: 'duration'
						},
						{
							value: '3 weeks',
							name: '3 weeks',
							type: 'duration'
						},
						{
							value: '1 month',
							name: '1 month',
							type: 'duration'
						},
						{
							value: '2 months',
							name: '2 months',
							type: 'duration'
						},
						{
							value: '3 months',
							name: '3 months',
							type: 'duration'
						},
						{
							value: '6 months',
							name: '6 months',
							type: 'duration'
						},
						{
							value: '1 year',
							name: '1 year',
							type: 'duration'
						}
					];
				}
				//Initialization of the range label should probably be done in the directive API
				$scope.rangeLabel = $scope.initialRange || $scope.ranges[$scope.ranges.length-1].value;
				$scope.stringDates = {
					startDate:'',
					endDate:''
				};

				//Triggered when user clicks on a new range (because rangeLabel is being watched)
				function setRange(range){
					if(range === 'custom'){return;}
					//This is because I just need one edge case of years, not fully fleshed out for other date types
					var rangeAsString = String(range);
					if(rangeAsString.length === 4){
						$scope.stringDates.startDate = '01/01/'+rangeAsString;
						$scope.stringDates.endDate = '12/31/'+rangeAsString;
						return;
					}
					var momentFormattedRange = range.split(' ');
					$scope.stringDates.startDate = moment().format('MM/DD/YYYY');
					$scope.stringDates.endDate = moment().add(momentFormattedRange[0],momentFormattedRange[1]).format('MM/DD/YYYY');
				}

				function stringToDate(scopeVar){
					return function(dateAsStringValue){
						if(scopeVar === 'endDate'){
							$scope.endDate = moment(dateAsStringValue).endOf('day').toDate();
							return;
						}
						$scope[scopeVar] = moment(dateAsStringValue).toDate();
					};
				}

				$scope.stringDates.endDate = moment().format('MM/DD/YYYY');

				$scope.$watch('stringDates.startDate', stringToDate('startDate'));
				$scope.$watch('stringDates.endDate', stringToDate('endDate'));
				$scope.$watch('rangeLabel', setRange);

				$scope.today = function() {
				    $scope.dt = new Date();
				};
				  
				$scope.today();

				$scope.clear = function () {
				    $scope.dt = null;
				};

				  // Disable weekend selection
				$scope.disabledDays = function(date, mode) {
				    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
				};

				$scope.togglePopover = function(pickerVar, $event) {
				    $event.preventDefault();
				    $event.stopPropagation();
				    $scope[pickerVar] = !$scope[pickerVar];
				};

				$scope.dateOptions = {
				    formatYear: 'yy',
				    startingDay: 0,
				    showWeeks: false
				};

				$scope.format = 'MM/dd/yyyy';

			},
			link: function postLink(scope, element, attrs) {
				// Time filter directive logic
				// ...
			}
		};
	}
]);