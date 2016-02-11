'use strict';

angular.module('trade').directive('miniChain', ['$q', 
    function($q) {
        return {
            templateUrl: '/modules/trade/directives/mini-chain.client.view.html',
            restrict: 'E',
            replace: true,
            scope: {
            	data: '='
            },
            link: function postLink(scope, element, attrs) {
                // Minichain directive logic
                // ...
                // console.log(scope.data);
                $q.all([scope.data]).then(function(response) {
                	console.log(response);
                	console.log(scope.data);
                	console.log('test');
                });
            }
        };
    }
]);
