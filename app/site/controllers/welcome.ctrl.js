(function(){

angular
	.module('lifeCalendarApp')
	.controller('WelcomeController', WelcomeController);

	function WelcomeController($state, $timeout){
		var ctrl = this;
		var hideleft = false;
		var lefttext = '';

		ctrl.actionClick = actionClick;
		ctrl.resetClick = resetClick;
		ctrl.register = register;
		ctrl.login = login;
		ctrl.about = about;
		ctrl.goHome = goHome;

		function actionClick(){
			ctrl.hideleft = true;
		}
		function resetClick(){
			ctrl.hideleft = false;
		}
		function register(){
			// ctrl.resetClick();
			ctrl.lefttext = "Sign up";
			ctrl.actionClick();
			$state.go('welcome.register');
		}
		function login(){
			// ctrl.resetClick();
			ctrl.lefttext = "Login";
			ctrl.actionClick();
			$state.go('welcome.login');
		}
		function about(){
			// ctrl.resetClick();
			ctrl.lefttext = "About";
			ctrl.actionClick();
			$state.go('welcome.about');
		}
		function goHome(){
			ctrl.resetClick();
			$state.go('welcome');
		}

	}
})();