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
		self.updateEvent = updateEvent;
		self.updateEvents = updateEvents; // Update the myEvents in this service AFTER database has been updated.

		self.myEmail;
		self.myUser;
		self.myEvents = []; // this is an array of event objects AFTER data has been returned.

//added
		self.getWeeks=getWeeks;
		self.Coordiante=Coordiante;

		function Coordiante(x,y,z){
			this.X=x;
			this.Y=y;
			this.Z=z;
		}

		function getWeeks(){
			self.array=[];
			var z=1;
			for(var j=0; j<=51; j++){
				var x=j*13;
				for (var i = 0 ; i <= 12; i++) {
					var y =i*13;
					var arr= new Coordiante(x,y,z);
					self.array.push(arr);
					z++;
				}
			}
			return self.array;	
		};

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

		function updateEvent(id, __event){
			__event = JSON.stringify(__event);
			return $http.put('api/events/update/' + id, __event)
				.then(function(data){
					console.log("updated event with id:" + id, data);
					if (res.status == 200){
						// event was updated successfully
						self.updateEvents(id, __event);
					}
				})
		}

		function updateEvents(id, __event){ 
		// this function is called by the function above, to update myEvents in this service
			for (var i=0; i<self.myEvents.length; i++){
				if (self.myEvents[i].id == id){
					self.myEvents[i].eventTitle = __event.eventTitle;
					self.myEvents[i].eventDescription = __event.eventDescription;
					self.myEvents[i].eventStart = __event.eventStart;
					self.myEvents[i].eventExpectedEnd = __event.eventExpectedEnd;
					self.myEvents[i].eventActualEnd = __event.eventActualEnd;
					self.myEvents[i].eventHasSkills = __event.eventHasSkills;
					self.myEvents[i].eventStatus = __event.eventStatus;
				}
			}
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
		
		//---------------Skills Model-------------//

	}

})();