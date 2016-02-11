'use strict';

// Init the application configuration module for AngularJS application settings and config
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'trading-portfolios';
	var applicationModuleVendorDependencies = ['ngResource','ngTouch', 'ui.router', 'ui.bootstrap', 'ui.utils', 'ngAnimate', 'cgBusy', 'etrade.components','smoothScroll','mgcrea.ngStrap','etrade-angular-decorators'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
		angular.module(applicationModuleName).value('cgBusyDefaults',{
			templateUrl:'lib/angular-busy/angular-busy.html',
			minDuration: 250,
			delay: 100,
			message: "Updating"
		});
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();