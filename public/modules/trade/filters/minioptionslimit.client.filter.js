'use strict';

angular.module('trade').filter('miniOptionsLimit', [
    function() {
        function closest(num, arr) {
            var currVal = arr[0].Call.strikePrice;
            var currIndex;
            var current = {};
            var diff = Math.abs(num - currVal);
            for (var val = 0; val < arr.length; val++) {
                var newdiff = Math.abs(num - arr[val].Call.strikePrice);
                if (newdiff < diff) {
                    diff = newdiff;
                    current.currVal = arr[val].Call.strikePrice;
                    current.currIndex = val;
                }
            }
            return current;
        }
        return function(strikes, lastPrice) {
            // miniOptionsLimit filter logic
            // ...
            var shownStrikes = [];
            // console.log(strikes);
            if (strikes) {
                var centerStrikePriceIndex = closest(lastPrice, strikes).currIndex;
                var min = centerStrikePriceIndex - 3;
                var max = centerStrikePriceIndex + 3;

                for (var h = min; h <= max; h++) {
                    if (strikes[h] === undefined) {
                        min += 1;
                        max += 1;
                    }
                }

                for (var i = min; i <= max; i++) {
                    shownStrikes.push(strikes[i]);
                }
                
                return shownStrikes;
            }
        };
    }
]);
