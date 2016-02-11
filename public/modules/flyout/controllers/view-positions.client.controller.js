'use strict';
angular.module('flyout').controller('ViewPositionsController', ['$scope', '$filter',
    function($scope, $filter) {

    // $scope.expandedRowsVisible = [];
    $scope.expandIcon = 'et-icon-plus';
    $scope.visiblePositions = [];
    $scope.totals = {};
    $scope.filters = {
        streaming: true,
        visible: false,
        showOpenOrders: false,
        symbols: [],
        symbolsString: '',
        openOrders: ''
        };
    // $scope.config.defaultView = JSON.parse(localStorage.getItem('defaultView')) || 0;
    // $scope.config.currentView = $scope.config.defaultView;
    $scope.config.defaultView = JSON.parse(localStorage.getItem('defaultView')) || 0;
    $scope.config.currentView = $scope.config.defaultView;
    $scope.toggleAll = function() {
        var willExpand;
        if ($scope.expandIcon === 'et-icon-plus') {
        willExpand = true;
        $scope.expandIcon = 'et-icon-minus';
        } else {
        willExpand = false;
        $scope.expandIcon = 'et-icon-plus';
        }
        $scope.expandedRowsVisible.forEach(function(current, index) {
        $scope.expandedRowsVisible[index] = willExpand;
        });
    };
    $scope.beforeScroll = function(element) {
        angular.element(element).addClass('scrollTo-active').addClass('scrollTo');
    };
    $scope.afterScroll = function(element) {
        angular.element(element).removeClass('scrollTo-active');
    };


    function processFilters(filters) {
        //This is different than gains-losses because I don't have time to refactor it into shareable code. I took out the term filter and changed what property date is filtering by, and I changed the summing functions.
        //LOOPS ARE COMING.
        //YOU GET A LOOP! SHE GETS A LOOP! EVERYBODY GETS A LOOP!
        //Filter by symbol first, so that we get rid of a lot of things quickly from future loops
        //Not sure why I need to run angular.copy, but otherwise it's making changes to $scope.gains and that's no good. So I'm just going to assume it's some angular voodoo assigning by reference unless you run copy, and just leave this here now since it works.
        $scope.visiblePositions = angular.copy($scope.portfolio[$scope.accountId]);
        $scope.visiblePositions = $filter('filter')($scope.visiblePositions, {
        _id: filters.symbolsString
        });
        //Sum up their values
        $scope.totals.visiblepositionsValue = $scope.visiblePositions.reduce(function(a, b) {
        return a + parseFloat(b.value);
        }, 0).toFixed(2);
        $scope.totals.visiblevalue = parseFloat($scope.totals.visiblepositionsValue) + parseFloat($scope.accountDetails[$scope.accountId].purchasingPower);
        $scope.totals.visibletotalGainDollar = $scope.visiblePositions.reduce(function(a, b) {
        return a + parseFloat(b.totalGainDollar);
        }, 0).toFixed(2);
        $scope.totals.visibledayGainDollar = $scope.visiblePositions.reduce(function(a, b) {
        return a + parseFloat(b.dayGainDollar);
        }, 0).toFixed(2);
        $scope.totals.visibletotalGainPercent = ($scope.totals.visibletotalGainDollar / ($scope.totals.visiblepositionsValue - $scope.totals.visibletotalGainDollar) * 100).toFixed(2);
        $scope.totals.visibledayGainPercent = ($scope.totals.visibledayGainDollar / ($scope.totals.visiblepositionsValue - $scope.totals.visibledayGainDollar) * 100).toFixed(2);
    }
    //this is a little weird but if you come to this page after the broadcast, the watchCollection will never happen, so I need to check if it's already been fetched. Probably a better way to do this but I'm not familiar enough with broadcasting/emitting events at this time.
    if (!$scope.portfolioLoaded) {
        $scope.$on('portfolioFetched', function() {
        $scope.$watchCollection('filters', processFilters);
        });
    } else {
        $scope.$watchCollection('filters', processFilters);
    }
    }
]);