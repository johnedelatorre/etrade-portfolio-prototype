'use strict';

angular.module('portfolio').controller('MarginController', ['$scope', 'api', '$filter', '$modal',
	function($scope, api, $filter, $modal) {
		$scope.filters = {
	    symbolFilter:'',
		securityTypeFilter:'!',
	};	
		$scope.requirements = {};
		$scope.requirementsTotal = function(requirements){
			var total = 0;
			if(Object.keys(requirements).length > 0){
				for (var symbol in requirements){
					total += requirements[symbol];
				}
			}
			return total;
		};

		//This is awful but the infrastructure isn't there to do this the right way.
		$scope.visibleRequirementsTotal = function(){
			var visibleRequirements = {};
			for (var symbol in $scope.requirements){
				if(symbol.indexOf($scope.filters.symbolFilter) >=0){
					visibleRequirements[symbol] = $scope.requirements[symbol];
				}
			}
			return $scope.requirementsTotal(visibleRequirements);
		};

		//Modal
		$scope.modal = {
		  "title": "Title",
		  "content": "Hello Modal<br />This is a multiline message!",
		  "template": "/modules/portfolio/views/margin-calculator.modal.view.html",
		  //show: false
		};	

		$scope.research = {};
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
		$scope.updateResearch = function(){
			$scope.research.symbols = $scope.research.symbolsString.split(',').map(function(element){
				return element.trim(',').toUpperCase();
			});
		};
	}
]);