(function(){
	'use strict'

	angular
		.module('lifeCalendarApp', [
			'ui.router', 
			'ngAnimate',
			'angular-jwt',
			'toastr',
			'ui.bootstrap',
			'angular-carousel'
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
					controller:'UserCtrl as ctrl',
					resolve:{
						userResolve: function(UserSrv){
							return UserSrv.getUserFromEmail();
						},
						eventsResolve: function(UserSrv){
							return UserSrv.getUserEvents();
						},
						skillsResolve: function(UserSrv){
							return UserSrv.getUserSkills();
						}
					}
				})
				.state('user.thisweek',{
					url:'/thisweek/',
					templateUrl:'site/partials/user-thisweek.html'
					
				})
				.state('user.overview',{
					url:'/overview/',
					templateUrl:'site/partials/user-overview.html'
					
				})
				.state('user.management',{
					url:'/management/',
					templateUrl:'site/partials/user-management.html'
				})	
				.state('user.profile', {
					url:'/profile/',
					templateUrl:'site/partials/user-profile.html'
				})

			$httpProvider.interceptors.push(function(jwtHelper){
				return {

					// For every request sent out, attach the authToken in the localStorage to the request header
					request: function(config){
						console.log('Request: ', config)
						
						if (localStorage.authToken != undefined){
							config.headers.authentication = localStorage.authToken;
						}
						console.log('request header', config.headers.authentication);
						return config;
					}, 

					// For every response received, if the response has valid authToken, store it in the localStorage
					response: function(response){
						var auth_token = response.headers('authentication');
						console.log('Response: ' + auth_token);
						// console.log(jwtHelper.decodeToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJAYi5jb20iLCJpZCI6NjIsImlhdCI6MTQ3MTQ2MTMzNX0.WvUZ9dLdnR6EnWtwrJAPb_Kj2SgzNwWcapCyxMRnvn0'))
						if (auth_token) {
							var decrypt_token = jwtHelper.decodeToken(auth_token);
							console.log('Decrypted token from response: ', decrypt_token);

							//check the decrypted token (token is encrypted from an object defined in auth.js in api route)
							if (decrypt_token.userEmail){
								localStorage.authToken = auth_token;
							}
						}
						return response;
					}
				}
			})
		})

		// block user from directly accessing state "user" from url bar
		.run(function ($rootScope, $state){
			$rootScope.$on('$stateChangeStart', function(event, toState){
				if(toState.name == 'user'){
					$state.go('user.thisweek');
				}
			})
		})
})();