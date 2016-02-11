'use strict';

angular.module('trade').factory('ConditionalTypeService', ['$rootScope',
    function($rootScope) {
        var service = {};

        service.prepForBroadcast = function(condition) {
            this.condition = condition;
            this.broadcastNotification(this.condition);
        };

        service.broadcastNotification = function(condition) {
            $rootScope.$broadcast('conditional.type', condition);
        };

        return service;
    }
]);
