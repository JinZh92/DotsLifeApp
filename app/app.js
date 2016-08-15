(function(){
	'use strict'

	angular
		.module('lifeCalendarApp', ['ui.router', 'ngAnimate']);

	angular
		.module('lifeCalendarApp')
		.config(function($stateProvider, $httpProvider, $urlRouterProvider){

			$urlRouterProvider.otherwise('/welcome');
			$stateProvider
			.state('welcome', {
				url: '/welcome',
				templateUrl:'site/partials/welcome.html',
				controller:'WelcomeController as ctrl'
			})
			.state('welcome.register', {
				url:'/register',
				templateUrl:'site/partials/register.html',
				controller:'WelcomeController as ctrl'
			})
			.state('welcome.login', {
				url:'/login',
				templateUrl:'site/partials/login.html',
				controller:'WelcomeController as ctrl'
			})
			.state('welcome.about', {
				url:'/about',
				templateUrl:'site/partials/about.html',
				controller:'WelcomeController as ctrl'
			})
		})

})();