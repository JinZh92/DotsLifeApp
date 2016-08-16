(function(){
	'use-strict';

	angular
		.module('lifeCalendarApp')
		.controller('AuthCtrl',AuthCtrl);

	AuthCtrl.$inject = ['$http'];

	function AuthCtrl($http){
		var ctrl = this;

		//buttons
		ctrl.register_btn = 'Sign Up';
		ctrl.auth_btn = "Log In";

		//Functions
		ctrl.register = register;
		ctrl.authenticate = authenticate;

		function register(){
			//check passwords
			if(ctrl.regisPwd == ctrl.regisRePwd && ctrl.regisPwd != ''){
				var user = {
					email:ctrl.regisEmail,
					password:ctrl.regisPwd
				}
				user = JSON.stringify(user);
				$http.post('/api/auth/register',user)
				.then(function(res){
					console.log(res);
					ctrl.register_btn = res.data.msg;
				})
			}
			else{
				ctrl.register_btn = "Passwords Don't Match";
			}
		}

		function authenticate(){
			var user = {
				email:ctrl.loginEmail,
				password:ctrl.loginPwd
			}

			user = JSON.stringify(user);
			$http.post('/api/auth/authenticate',user)
			.then(function(res){
				console.log(res);
				localStorage.loginEmail = ctrl.loginEmail;
				ctrl.auth_btn = res.data.msg;
			})
		}
	}
})();