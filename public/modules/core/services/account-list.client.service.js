'use strict';

angular.module('core').factory('AccountList', ['$resource',
  function($resource) {
    return $resource('accounts');
  }
]);