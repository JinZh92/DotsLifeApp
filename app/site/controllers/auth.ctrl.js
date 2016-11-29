(function(){
	'use strict';

	angular
		.module('lifeCalendarApp')
		.controller('AuthCtrl',AuthCtrl);

	AuthCtrl.$inject = ['$state', '$http', 'UserSrv', 'toastr'];

	function AuthCtrl($state, $http, UserSrv, toastr){
		var ctrl = this;

		//buttons
		ctrl.register_btn 	= 'Sign Up';
		ctrl.auth_btn 		= "Log In";

		//Functions
		ctrl.register 		= register;
		ctrl.authenticate 	= authenticate;

		//Variables
		ctrl.showRegisError = false;
		ctrl.showAuthError 	= false;
		ctrl.errorMsg 		= '';

		// //test test
		// ctrl.getAllUserData = UserSrv.getAllUserData();

		function register(){
			//check passwords
			if(ctrl.regisPwd == ctrl.regisRePwd && ctrl.regisPwd != ''){
				var user = {
					userEmail:ctrl.regisEmail,
					userPswd:ctrl.regisPwd,
					userFullName:ctrl.regisName,
					userBirthday:ctrl.regisBday,
					currEvents: []
				}
				user = JSON.stringify(user);
				$http.post('/api/auth/register',user)
				.then(function(res){
					console.log("register res: ", res);
					ctrl.showRegisError = false;
					ctrl.register_btn = res.data.msg;
					return res;
				}, function(err){
					ctrl.showRegisError = true;
				})
				.then(function(){
					// Log user in after register successfully
					ctrl.authenticate(ctrl.regisEmail, ctrl.regisPwd);
				})
			}
			else{
				ctrl.register_btn = "Passwords Don't Match";
			}
		}

		function authenticate(email, password){

			var user = {
				userEmail:email,
				userPswd:password
			}

			user = JSON.stringify(user);
			$http.post('/api/auth/authenticate',user)
			.then(function(res){
				console.log("authenticate res: ", res.data);

				// Storing the authToken and loginEmail in the local storage TODO: Cookies
				localStorage.loginEmail = res.data.userEmail;
				localStorage.authToken = res.data.token;
				ctrl.showError 	= false;
				ctrl.auth_btn	= res.data.msg;
				// Go to user page when logged in successful 
				toastr.success('Logged in as: ' + localStorage.loginEmail);
				$state.go('user.thisweek');
			}, function(err){
				if (err.data.err == "unauhthorized"){
					ctrl.errorMsg = "Email and password don't match!";
				} else if (err.data.err == "User does not exist"){
					ctrl.errorMsg = "User does not exist. Please Sign up first.";
				}

				// console.log("error message", err)
				ctrl.showAuthError 	= true;
			})
		}


	}
})();