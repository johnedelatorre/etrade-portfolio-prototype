'use strict';
angular.module('portfolio').controller('GainsLossesController', ['$scope', '$filter', 'Portfolio',
    function($scope, $filter, Portfolio) {
        $scope.gains = {};
	// $scope.expandedRowsVisible = [];
        $scope.expandIcon = 'et-icon-plus';
        $scope.filters = {
            startDate: '',
            endDate: '',
            symbolFilter: '',
            term: '!',
            dateRanges: [{
		value: new Date().getFullYear() - 2,
		name: new Date().getFullYear() - 2,
                type: 'year'
            }, {
                value: new Date().getFullYear() - 1,
                name: new Date().getFullYear() - 1,
                type: 'year'
	    },{
		value: new Date().getFullYear(),
		name: new Date().getFullYear(),
                type: 'year'
            }]
        };
        $scope.totals = {};
        $scope.visiblePositions = [];
	$scope.level2Expanded=[];
        $scope.loadGainsLosses = function(accountId) {
            $scope.accountId = accountId;
            Portfolio.gains({
                accountId: accountId
            }).$promise.then(function(res) {
                $scope.gains[accountId] = res;
                $scope.$broadcast('gainsFetched');
            });
        };

	$scope.$watchCollection('filters',function(){
	    $scope.level2Expanded=[];
	});
        $scope.toggleAll = function() {
            var willExpand;
            if ($scope.expandIcon === 'et-icon-plus') {
                willExpand = true;
                $scope.expandIcon = 'et-icon-minus';
            } else {
                willExpand = false;
                $scope.expandIcon = 'et-icon-plus';
            }
	    $scope.expandedRowsVisible.forEach(function(current, index) {
		$scope.expandedRowsVisible[index] = willExpand;
            });
        };
        //This could use some refactoring so it doesn't get called a bunch of times. Maybe inside a $scope.$watch
        // $scope.visiblePositions = function(){
        // return $filter('filter')($scope.gains[$scope.accountId], {_id:$scope.symbolFilter});
        // };
        $scope.visiblePositionsTotal = function(property) {
            return $scope.visiblePositions.reduce(function(prev, current) {
                return prev + current[property];
            }, 0);
        };

        function processFilters(filters) {
            //LOOPS ARE COMING.
            //YOU GET A LOOP! SHE GETS A LOOP! EVERYBODY GETS A LOOP!
            //Filter by symbol first, so that we get rid of a lot of things quickly from future loops
            //Not sure why I need to run angular.copy, but otherwise it's making changes to $scope.gains and that's no good. So I'm just going to assume it's some angular voodoo assigning by reference unless you run copy, and just leave this here now since it works.
            $scope.visiblePositions = angular.copy($scope.gains[$scope.accountId]);
            $scope.visiblePositions = $scope.visiblePositions.filter(function(element, index, array) {
                if (filters.symbolFilter === '') {
                    return true;
                }
                //TODO: figure out how to check for multiple symbols
                var caseInsensitiveFilter = new RegExp(filters.symbolFilter,'i');
                if (element._id.search(caseInsensitiveFilter)>=0) {
                    return true;
                }
            });
            //Now filter by date on individual lots (and term)
            $scope.visiblePositions.forEach(function(element, index, array) {
		element.quantity = 0;
                element.lots = element.lots.filter(function(lot) {
                    var lotDate = new Date(lot.timeSold);
                    if (lotDate >= filters.startDate && lotDate <= filters.endDate) {
                        if ($scope.filters.term === '!' || lot.term === $scope.filters.term) {
			    element.quantity += lot.quantity;
                            return true;
                        }
                    }
                });
            });
            //Now get rid of empty positions. There should be a way to do this in the previous function, but modular code vs. performance, and this is easier to do.
            $scope.visiblePositions = $scope.visiblePositions.filter(function(element, index, array) {
                if (element.lots.length) {
                    return true;
                }
            });
            //Sum up their values
            $scope.visiblePositions.forEach(function(element, index, array) {
                ['totalCost', 'proceeds', 'gainLoss'].forEach(function(property, index, array) {
                    element[property] = element.lots.reduce(function(a, b) {
                        return a + parseFloat(b[property]);
                    }, 0);
                });
                element.shortTermGain = element.lots.reduce(function(a, b) {
                    // console.log(a);
                    // console.log(b);
                    if (b.term === 'Short') {
                        return a + parseFloat(b.gainLoss);
                    } else {
                        return a;
                    }
                }, 0);
                element.longTermGain = element.lots.reduce(function(a, b) {
                    if (b.term === 'Long') {
                        return a + parseFloat(b.gainLoss);
                    } else {
                        return a;
                    }
                }, 0);
            });
        }
        // if(!$scope.portfolioLoaded){
        // console.log('wait then watch');
        $scope.$on('gainsFetched', function() {
            $scope.$watchCollection('filters', processFilters);
        });
        // } else {
        // console.log('just watch');
        // $scope.$watchCollection('filters',processFilters);
        // }
    }
]);