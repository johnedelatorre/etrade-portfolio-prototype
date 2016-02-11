'use strict';

angular.module('trade').factory('Trades', ['$resource',
    function($resource) {
        // Trades service logic
        // ...
        var options = {};
        var actions = {
            'query': {
                method: 'GET',
                isArray: false
            }
        };

        // Public API
        return {
            index: $resource('/trade', options, actions),
            stock: $resource('/trade/stock', options, actions),
            option: $resource('/trade/option', options, actions),
            mutualfund: $resource('/trade/mutualfund', options, actions)
        };
    }
]);
