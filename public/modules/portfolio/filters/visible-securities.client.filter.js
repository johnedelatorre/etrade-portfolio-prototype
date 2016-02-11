'use strict';

angular.module('portfolio').filter('visibleSecurities', [
	function() {
		return function(input, expanded) {
			if (typeof(expanded) === "undefined"){
				expanded = false;
			}
			var tempResults = input.filter(function(value){
				return value.visible;
			});

			var results = tempResults.map(function(current){
				return current.name;
			})


			if(results.length === 0 || results.length === input.length){
				if(expanded){
					results = input.map(function(value){
						return value.name;
					});
				} else{
					results = ["All Securities"];
				}
			}

			// var allSecurities = {name:"All Securities"};
			// results.push(allSecurities);
			return results;
		};
	}
]);
