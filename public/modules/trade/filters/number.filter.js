'use strict';

angular.module('trade').filter('million', function() {
  return function(input) {   
    input = Number(input/1000000).toFixed(2);
    return input;
  };
})
.filter('toFixed2', function(){
    return function(input) {
        // if(input)
        // console.log(input);
        input = Number(input).toFixed(2);
        return input;
    };
});
