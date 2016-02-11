'use strict';

//Start by defining the main module and adding the module dependencies for setting config
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]).config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.headers.common.ConsumerKey = '4bfbff438e3a35641b33643118cb6242';
      }
  ]).config(function($popoverProvider) {
    angular.extend($popoverProvider.defaults, {
      animation: 'am-collapse',
      trigger: 'click',
      autoClose: true,
      placement: 'bottom'
    });
  }).constant('moment',moment)
    .run(['$rootScope', function($rootScope) {
    $rootScope.debug = {enable: true };
    $rootScope.$watch('debugContent', function() {
      $rootScope.debug.content = $rootScope.debugContent;
    });
  }]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});