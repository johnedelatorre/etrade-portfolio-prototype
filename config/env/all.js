'use strict';

module.exports = {
	app: {
		title: 'Trading & Portfolios',
		description: 'Trading & Portfolios Prototype',
		keywords: 'mongodb, express, angularjs, node.js'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/etrade-bootstrap/dist/css/etrade-bootstrap.css',
				'public/lib/etrade-prototype-nav/responsive2/custom.css',
				'public/lib/etrade-prototype-nav/responsive2/stylesheet.css',
				'public/lib/angular-busy/angular-busy.css',
				'public/lib/angular-motion/dist/angular-motion.min.css',
				'public/lib/bootstrap-additions/dist/bootstrap-additions.min.css'
			],
			js: [
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/modernizr/modernizr.js',
				'public/lib/angular/angular.min.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-busy/angular-busy.js',
				'public/lib/angular-touch/angular-touch.js',
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-ui-utils/ui-utils.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/etrade-prototype-nav/responsive2/bella-port-en_US-debug.js',
				'public/lib/moment/min/moment.min.js',
				'public/lib/ngSmoothScroll/angular-smooth-scroll.js',
				'public/lib/angular-strap/dist/angular-strap.min.js',
				'public/lib/etrade-angular-components/directives/directives.js',
				'public/lib/etrade-angular-components/common/decorators.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
