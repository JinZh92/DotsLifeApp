(function(){
	'use strict'

	angular
		.module('lifeCalendarApp')
		.service('UserSrv', UserSrv);

	function UserSrv($http, jwtHelper) {
		var self = this;

		self.getEmailFromToken = getEmailFromToken;
		self.getAllUserData = getAllUserData;
		self.getUserFromEmail = getUserFromEmail;
		self.createEvent = createEvent;
		self.getUserEvents = getUserEvents;

		self.myEmail;
		self.myUser;
		self.myEvents; // this is an array of event objects AFTER data has been returned.


		// decode the authToken from current local storage, and set it to self.myEmail.
		function getEmailFromToken(){
			var decrypt_token = jwtHelper.decodeToken(localStorage.authToken);
			self.myEmail = decrypt_token.userEmail;
		}

		//-------------Users Model--------------//
		function getAllUserData(){
			return $http.get('/api/users')
				.then(function(data){
					console.log('Get all users data service', data);
					return data.data.users;
				}, function (err){
					return err;
				})
		}

		function getUserFromEmail(){
			return $http.get('api/users/' + self.myEmail)
				.then(function(data){				
					console.log("Get user from email " + self.myEmail, data);
					self.myUser = data.data.user;
					return data.data.user;
				})
		}

		//-------------Events Model------------//
		function getUserEvents(){
			return $http.get('api/events/' + self.myEmail)
				.then(function(data){
					console.log(data.data.events);
					self.myEvents = data.data.events;
					return data.data.events;
				})
		}

		function createEvent(event){
			// move to controller later
			// only update those that need to be updated.
			// event = {
			// 	userEmail: 'test@t.com',
			//     eventTitle: 'testEvent2',
			//     eventDescription: 'testEvent2Description',
			//     eventStart: new Date(Date.now()),
			//     eventExpectedEnd: new Date('8/20/2016'), // august 20
			//     eventHasSkills: [1,2,3],
			//     eventStatus:'ONGOING'
			// }
			event = JSON.stringify(event);
			$http.post('/api/events/create',event)
				.then(function(res){
					//do something when event post request is successful
				})
		}
		

	}

})();