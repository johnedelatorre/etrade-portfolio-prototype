'use strict';
angular.module('portfolio').controller('IncomeController', ['$scope',
    function($scope) {
	// Controller Logic
	// ...
	$scope.filters = {
	    symbolFilter: '',
	    startDate: '',
	    endDate: '',
	    securityType: '!'
	};
	$scope.expandedRowsVisible = [];
	$scope.toggleRow=function($event, row){
	var attributes = $event.originalEvent.target.attributes;
	for(var attribute in attributes){
	    if(attributes[attribute].name === 'ng-click' || attributes[attribute].name === 'href'){
		return;
	    }
	}
	$scope.expandedRowsVisible[row] = !$scope.expandedRowsVisible[row];
    };

	$scope.chartConfig = {
	    //This is not a highcharts object. It just looks a little like one!
	    options: {
		chart: {
		    type: 'column'
		},
		title: {
		    text: ''
		},
		xAxis: {
		    categories: ['March', 'April', 'May', 'June', 'July','August']
		},
		yAxis: {
		    min: 0,
		    title: {
			text: ''
		    },
		    stackLabels: {
			enabled: false,
			style: {
			    fontWeight: 'bold'
			    // color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
			}
		    }
		},
		legend: {
		    align: 'right',
		    x: -30,
		    verticalAlign: 'top',
		    y: 25,
		    floating: true,
		    // backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
		    borderColor: '#CCC',
		    borderWidth: 1,
		    shadow: false
		},
		tooltip: {
		    formatter: function() {
			return '<b>' + this.x + '</b><br/>' + this.series.name + ': ' + this.y + '<br/>' + 'Total: ' + this.point.stackTotal;
		    }
		},
		plotOptions: {
		    column: {
			stacking: 'normal',
			dataLabels: {
			    enabled: false,
			    // color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
			    style: {
				textShadow: '0 0 3px black'
			    }
			}
		    }
		}
	    },
	    //The below properties are watched separately for changes.
	    //Series object (optional) - a list of series using normal highcharts series options.
	    series: [{
		name: 'Estimated',
		data: [5, 3, 4, 7, 2, 5]
	    }, {
		name: 'Announced',
		data: [2, 2, 3]
	    }],
	    //size (optional) if left out the chart will default to size of the div or something sensible.
	    //function (optional)
	    func: function(chart) {
		//setup some logic for the chart
	    }
	};
	function processFilters(filters){
	//This is different than gains-losses because I don't have time to refactor it into shareable code. I took out the term filter and changed what property date is filtering by, and I changed the summing functions.

		//LOOPS ARE COMING.
		//YOU GET A LOOP! SHE GETS A LOOP! EVERYBODY GETS A LOOP!

		//Filter by symbol first, so that we get rid of a lot of things quickly from future loops

		//Not sure why I need to run angular.copy, but otherwise it's making changes to $scope.gains and that's no good. So I'm just going to assume it's some angular voodoo assigning by reference unless you run copy, and just leave this here now since it works.
		$scope.visiblePositions = angular.copy($scope.portfolio[$scope.accountId]);

		$scope.visiblePositions = $scope.visiblePositions.filter(function(element, index, array){
			if(element.dividend){
				if(filters.symbolFilter === ''){
					return true;
				}
				//TODO: figure out how to check for multiple symbols/partial matches
				var caseInsensitiveSymbolFilter = new RegExp(filters.symbolFilter, 'i');
				if (element._id.search(caseInsensitiveSymbolFilter) >= 0){
					return true;
				}
			}

		});

		//Now filter by date on individual lots
		$scope.visiblePositions = $scope.visiblePositions.filter(function(position){
			var payableDate = new Date(position.dividendPayableDate*1000);
			if(payableDate >= filters.startDate && payableDate <= filters.endDate){
					return true;
			}
		});

		//Now get rid of empty positions. There should be a way to do this in the previous function, but modular code vs. performance, and this is easier to do.
		// $scope.visiblePositions = $scope.visiblePositions.filter(function(element,index,array){
		// 	if(element.lots.length){
		// 		return true;
		// 	}
		// });

		//Sum up their values
		$scope.visiblePositions.estIncome = $scope.visiblePositions.reduce(function(a,b){
			return a + parseFloat(b.estIncome);
		}, 0).toFixed(2);


	}

	//this is a little weird but if you come to this page after the broadcast, the watchCollection will never happen, so I need to check if it's already been fetched. Probably a better way to do this but I'm not familiar enough with broadcasting/emitting events at this time.
	if(!$scope.portfolioLoaded){
		$scope.$on('portfolioFetched', function(){$scope.$watchCollection('filters',processFilters);});
	} else{
		$scope.$watchCollection('filters', processFilters);
	}

    }
]);