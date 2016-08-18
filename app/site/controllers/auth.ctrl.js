(function(){
	'use-strict';

	angular
		.module('lifeCalendarApp')
		.controller('AuthCtrl',AuthCtrl);

	AuthCtrl.$inject = ['$state', '$http', 'UserSrv'];

	function AuthCtrl($state, $http, UserSrv){
		var ctrl = this;

		//buttons
		ctrl.register_btn = 'Sign Up';
		ctrl.auth_btn = "Log In";

		//Functions
		ctrl.register = register;
		ctrl.authenticate = authenticate;

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
					console.log("register res: " + res);
					ctrl.register_btn = res.data.msg;
				})
			}
			else{
				ctrl.register_btn = "Passwords Don't Match";
			}
		}

		function authenticate(){
			var user = {
				userEmail:ctrl.loginEmail,
				userPswd:ctrl.loginPwd
			}

			user = JSON.stringify(user);
			$http.post('/api/auth/authenticate',user)
			.then(function(res){
				console.log("authenticate res: ", res.data);

				// Storing the authToken and loginEmail in the local storage TODO: Cookies
				localStorage.loginEmail = res.data.userEmail;
				localStorage.authToken = res.data.token;
				ctrl.auth_btn = res.data.msg;
				// Go to user page when logged in successful
				$state.go('user');
			})
		}


	}
})();