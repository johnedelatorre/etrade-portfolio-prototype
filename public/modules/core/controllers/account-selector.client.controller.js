'use strict';

angular.module('core').controller('AccountSelectorController', ['$scope', 'AccountList', 'AccountIdService',
  function($scope, AccountList, AccountIdService) {
    
    $scope.loadAccounts = function(){
      AccountList.query().$promise.then(function(res) {
        $scope.accounts = res;
      }).then(function() {
        $scope.accountId = $scope.accounts[0]._id;
        $scope.$watch('accountId', function() {
          AccountIdService.prepForBroadcast($scope.accounts, $scope.accountId);
        });
      }).catch(function(e) {
        console.log(e);
      });
    };
  }
]);