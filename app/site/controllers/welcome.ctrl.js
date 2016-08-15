(function(){

angular
	.module('lifeCalendarApp')
	.controller('WelcomeController', WelcomeController);

	function WelcomeController($state, $timeout){
		var ctrl = this;
		var hideleft = false;

		ctrl.actionClick = actionClick;
		ctrl.resetClick = resetClick;
		ctrl.register = register;
		ctrl.login = login;
		ctrl.about = about;

		function actionClick(){
			ctrl.hideleft = true;
		}
		function resetClick(){
			ctrl.hideleft = false;
		}
		function register(){
			ctrl.resetClick();
			ctrl.actionClick();
			$state.go('welcome.register');
		}
		function login(){
			ctrl.resetClick();
			ctrl.actionClick();
			$state.go('welcome.login');
		}
		function about(){
			ctrl.resetClick();
			ctrl.actionClick();
			$state.go('welcome.about');
		}

	}
})();