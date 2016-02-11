'use strict';

angular.module('portfolio').directive('etQuickQuote', ['$popover',
	function($popover) {
		return {
			restrict: 'A',
			scope:{
				symbol:'=symbol',
				quote: '=etQuickQuote'
			},
			link: function postLink(scope, element, attrs) {
				var popover = $popover(element, {
						template:'/modules/portfolio/views/partials/modal-quote.client.view.html',
						animation:'am-fade-and-slide-top',
						autoClose: 1,
						placement: 'bottom-left'
					});

				//Symbol is needed even if a quote is passed in because the news needs fetching.
				popover.$scope.symbol = scope.symbol;
				//This should probably be rewritten to check if quote data is passed in. If not, it should fetch that data based on symbol.
				popover.$scope.position = scope.quote;
			}
		};
	}
]);