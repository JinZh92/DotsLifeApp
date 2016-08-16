(function(){
	'use strict'

	angular
		.module('lifeCalendarApp', [
			'ui.router', 
			'ngAnimate',
			'angular-jwt'
		]);

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
				controller:'AuthCtrl as ctrl'
			})
			.state('welcome.login', {
				url:'/login',
				templateUrl:'site/partials/login.html',
				controller:'AuthCtrl as ctrl'
			})
			.state('welcome.about', {
				url:'/about',
				templateUrl:'site/partials/about.html',
				controller:'WelcomeController as ctrl'
			})
			.state('user', {
				url:'/user',
				templateUrl:'site/partials/user.html',
				controller:'UserCtrl as ctrl'
			})
			.state('user.thisweek',{
				url:'/thisweek/:userId',
				templateUrl:'site/partials/user-thisweek.html',
				controller:'UserCtrl as ctrl'
			})
		})

})();