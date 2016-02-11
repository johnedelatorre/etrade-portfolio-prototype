'use strict';

angular.module('core').factory('AccountIdService', ['$rootScope', 
  function($rootScope) {
    var service = {};

    service.prepForBroadcast = function(accounts, accountId) {
      this.accountId = accountId;
      this.accounts = accounts;
      this.broadcastNotification(this.accounts, this.accountId);
    };

    service.broadcastNotification = function(accounts, accountId) {
      $rootScope.$broadcast('account.handleAccountId', accounts, accountId);
    };
    
    return service;
  }
]);