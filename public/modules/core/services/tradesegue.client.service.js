'use strict';

angular.module('core').factory('tradeSegue', [
    function() {

        var trade = {};

        return {
            set: function(positionOrLot, orderType) {
                trade = positionOrLot;
                trade.orderType = orderType;
                return true;
            },
            get: function() {
                var positionOrLot = trade;
                trade = {};
                return positionOrLot;
            }

        };
    }
]);
