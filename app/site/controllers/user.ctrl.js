(function(){
	'use strict';

	angular
		.module('lifeCalendarApp')
		.controller('UserCtrl',UserCtrl)

	function UserCtrl($state, UserSrv, userResolve, $rootScope){
		var ctrl = this;

		//check if logged in. If yes, get the userEmail from the authToken
		if (localStorage.authToken == undefined || localStorage.authToken == null){
			$state.go('welcome');
		} else {
			// With resolve, the page is loaded after the email-specific data has already been returned
			ctrl.myData = userResolve;
			ctrl.myEmail = ctrl.myData.userEmail;
			console.log("resolve: ", ctrl.myData);
			console.log("my email: ", ctrl.myEmail);
		}

		// declare variables
		ctrl.myEmail;
		ctrl.myData;
		ctrl.getUserEvents = UserSrv.getUserEvents();

		// declare functions
		ctrl.logout = logout;
		ctrl.thisweekClick = thisweekClick;
		ctrl.overviewClick = overviewClick;

		// Clear the authToken from localStorage when user logs out
		function logout(){
			localStorage.removeItem('authToken');
			$state.go('welcome');
		}

		// Button clicking functions 
		function thisweekClick(){
			$state.go('user.thisweek');
		}
		function overviewClick(){
			$state.go('user.overview');
		}
		
		ctrl.array=UserSrv.getWeeks();		


	}	

})();



