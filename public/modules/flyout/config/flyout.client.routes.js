'use strict';
//Setting up route
angular.module('flyout').config(['$stateProvider',
    function($stateProvider, $urlRouteProvider) {
        // flyout state routing
        $stateProvider.
        state('flyout', {
            url: '/flyout',
            templateUrl: 'modules/flyout/views/index-flyout.client.view.html'
        }).
        //This is gnarly because https://github.com/angular-ui/ui-router/issues/948. Using @slessan's workaround
        state('flyout.positions', {
            url: '',
            views: {
                '': {
            templateUrl: 'modules/flyout/views/positions.client.view.html',
            controller: 'PositionsController'
                },
                '@portfolio.positions': {
                    templateUrl: 'modules/flyout/views/view-positions.client.view.html',
                    controller: 'ViewPositionsController'
                }
            }
        });
    }
]);