'use strict';
//Setting up route
angular.module('portfolio').config(['$stateProvider',
    function($stateProvider, $urlRouteProvider) {
        // Portfolio state routing
        $stateProvider.
        state('portfolio', {
            abstract: true,
            url: '/portfolio',
            templateUrl: 'modules/portfolio/views/portfolio.client.view.html'
        }).
        //This is gnarly because https://github.com/angular-ui/ui-router/issues/948. Using @slessan's workaround
        state('portfolio.positions', {
            url: '',
            views: {
                '': {
            templateUrl: 'modules/portfolio/views/positions.client.view.html',
            controller: 'PositionsController'
                },
                '@portfolio.positions': {
                    templateUrl: 'modules/portfolio/views/view-positions.client.view.html',
                    controller: 'ViewPositionsController'
                }
            }
        }).
        state('portfolio.positions.customize', {
            url: '/customize',
            templateUrl: 'modules/portfolio/views/customize-positions.client.view.html',
            controller: 'CustomizePositionsController'
        }).
        state('portfolio.margin', {
            url: '/margin',
            templateUrl: 'modules/portfolio/views/margin.client.view.html'
        }).
        state('portfolio.analysis', {
            url: '/analysis',
            templateUrl: 'modules/portfolio/views/analysis.client.view.html'
        }).
        state('portfolio.income', {
            url: '/income',
            templateUrl: 'modules/portfolio/views/income.client.view.html'
        }).
        state('portfolio.gains-losses', {
            url: '/gains-losses',
            templateUrl: 'modules/portfolio/views/gains-losses.client.view.html'
        });
    }
]);