(function(){
	'use strict';
	
	angular
		.module('lifeCalendarApp')
		.controller('WelcomeController', WelcomeController);

	WelcomeController.$inject = ['$state', '$timeout'];

	function WelcomeController($state, $timeout){
		var ctrl = this;
		var hideleft = false;
		var lefttext = '';

		//Check if already logged in
		if (localStorage.authToken) {
			console.log('Already logged in!!');
			$state.go('user.thisweek');
		}

		ctrl.actionClick 	= actionClick;
		ctrl.resetClick 	= resetClick;
		ctrl.register 		= register;
		ctrl.login 			= login;
		ctrl.about 			= about;
		ctrl.goHome 		= goHome;
		ctrl.goDotslife 	= goDotslife;
		ctrl.getThisWeek 	= getThisWeek;
		ctrl.getWeeks 		= getWeeks;

		ctrl.thisWeek;
		ctrl.array = ctrl.getWeeks();

		function actionClick(){
			ctrl.hideleft = true;
		}
		function resetClick(){
			ctrl.hideleft = false;
			$state.go('welcome');
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
			ctrl.actionClick();
			$state.go('welcome.about');
			ctrl.lefttext = "About";
		}
		function goHome(){
			ctrl.resetClick();
		}
		function goDotslife(){

			ctrl.actionClick();
			ctrl.thisWeek = ctrl.getThisWeek(ctrl.bday);
			console.log('this week:', ctrl.thisWeek);
			$state.go('welcome.dotslife')
			ctrl.lefttext = " ";

		}

		function getThisWeek(bday){
			console.log(bday)
			var time_now 	= new Date(Date.now());
			var bd 			= new Date(bday);
			return Math.ceil((time_now - bd)/(1000*3600*24*7))
		}
		function Coordinate(x,y,z){
			this.X=x;
			this.Y=y;
			this.Z=z;
		}
		function getWeeks(){
			var newarray = [];
			var z = 1;
			for(var i=0; i<=84; i++){ // columns 84
				var y=i*11;
				for (var j = 0 ; j <= 51; j++) { // rows  51
					var x =j*11;
					var arr= new Coordinate(x,y,z);
					newarray.push(arr);
					z++;
				}
			}	
			return newarray;
		};

	}
})();