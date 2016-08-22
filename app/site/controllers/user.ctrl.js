(function(){
	'use strict';

	angular
		.module('lifeCalendarApp')
		.controller('UserCtrl',UserCtrl)

	function UserCtrl($state, UserSrv, userResolve, $rootScope, toastr){
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

		//------------Variable Declaration------------//
		ctrl.myEmail; // User email as string
		ctrl.myData; // User object
		ctrl.myEvents = UserSrv.getUserEvents(); // array of all user's events
		ctrl.mySkills = UserSrv.getUserSkills(); // array of all user's skills
		ctrl.incompleteEvents = [];	
		ctrl.priorityEvents = [];

		ctrl.array = UserSrv.getWeeks();

		// Get This Week
		ctrl.getThisWeek = UserSrv.getThisWeek();

		//------------Function Declarations------------//
		ctrl.logout = logout;
		ctrl.thisweekClick = thisweekClick;
		ctrl.overviewClick = overviewClick;
		ctrl.toAnnouncement = toAnnouncement;
		ctrl.isThisWeek = isThisWeek;
		ctrl.addEvent = addEvent;
		ctrl.concludeEvent = concludeEvent;
		ctrl.editEvent = editEvent;
		ctrl.getEventsFromWk = getEventsFromWk;
		ctrl.showIncomplete = showIncomplete;
		ctrl.editUser = editUser;
		ctrl.addSkill = addSkill;
		ctrl.addSkillToken = addSkillToken;
		ctrl.levelUp = levelUp;
		ctrl.updateUserDb = updateUserDb;
		ctrl.updateEventDb = updateEventDb;
		ctrl.updateSkillDb = updateSkillDb;

		// Clear AuthToken from LocalStorage
		function logout(){
			localStorage.removeItem('authToken');
			$state.go('welcome');
			toastr.success('Successfully logged out.');
		}

		//------------Button Event Listener------------//
		function thisweekClick(){
			$state.go('user.thisweek');
		}
		function overviewClick(){
			$state.go('user.overview');
		}


		//--------------Event Functions--------------//
		// check if en event is before the end of this week
		function isThisWeek(event){
			var thisWeekNumber = ctrl.getThisWeek;
			var endTime = ctrl.myData.userBirthday;
			endTime.setTime(endTime.getTime() + (7*(thisWeekNumber)) * 86400000);
			var eventStart = new Date(event.eventStart);
			var weekEnd = new Date(endTime);
			console.log("Eventstart before Weekend??", eventStart<=weekEnd)
			return eventStart <= weekEnd;
		}

		function showIncomplete(){
			var incompleteArr = [];
			//TODO return array of envets that are incomplete and scheduled for this week
			ctrl.myEvents.forEach(function(event){
				if (event.eventStatus == 'INCOMPLETE' && ctrl.isThisWeek(event)){
					console.log("checking if event should be showed!")
					incompleteArr.push(event);
				}
			})
		}

		function addEvent(){
			var newEventStart = new Date(ctrl.newEventStart);
			var newEventExpectedEnd = new Date(ctrl.newExpectedEnd);
			var event = {
				userEmail: ctrl.myEmail,
				eventTitle: ctrl.newEventTitle,
				eventDescription: ctrl.newEventDes,
				eventStart: newEventStart,
				eventExpectedEnd: newEventExpectedEnd,
				eventHasSkills: [],
				eventStatus: 'INCOMPLETE'
			}
			UserSrv.createEvent(event);
			ctrl.myEvents = UserSrv.getUserEvents();
		}

		function concludeEvent(){
			//TODO setSpecial/levelUp/setActualEnd/checkFinishedSuccessful

		}

		function editEvent(){
			//TODO: Can edit only when it's incomplete.
		}

		function getEventsFromWk(start, end){
			//TODO start and end are week
			var st = Math.min(start, end);
			var en = Math.max(start, end);
			var bd = new Date(ctrl.myData.userBirthday);
			console.log("Get events from wk, birthday is: ", bd);

			var startDate = bd.setTime(bd.getTime() + (7*(st-1)) * 86400000)
			console.log("Start Date: ", startDate);

			bd = new Date(ctrl.myData.userBirthday);
			var endDate = bd.setTime(bd.getTime() + (7*(en)) * 86400000);
			console.log("End Date: ", endDate);



		}

		function toAnnouncement(){
			//TODO: return an array of events that set to special and are 10*k weeks away from now
			// and events with high priority
		}


		//--------------User Functions--------------//
		function editUser(){
			//TODO
		}

		//--------------Skill Functions--------------//
		function addSkill(){
			//TODO
		}

		function addSkillToken(){

		}

		function levelUp(id, date){
			//TODO: level up the skill based on current level if there are enough tokens
			// date is an Date object
			for (var i=0; i<ctrl.mySkills.length; i++){
				if (ctrl.mySkills[i].id == id){
					var currentLevel = ctrl.mySkills[i].skillLevel;
					var tokensNeeded = Math.floor(2 * (Math.log(currentLevel+1) / Math.log(3)) + 1);
					if (ctrl.mySkills[i].tokensTotal >= tokensNeeded){
						ctrl.mySkills[i].skillLevel += 1;
						ctrl.mySkills[i].tokensTotal -= tokensNeeded;
						ctrl.mySkills[i].levelUpDate.push(date);
					}
				}
			}
			
		}

		//------------Update Data in Controller to DB------------//

		// Update the User data to database
		function updateUserDb(){
			var __user = {			
				userFullName: ctrl.myData.userFullName,
				userBirthday: ctrl.myData.userBirthday,
				currEvents: ctrl.myData.currEvents
			}
			UserSrv.updateUser(ctrl.myData.userEmail, __user);
		}

		// Update the Events to database
		function updateEventDb(){
			for (var i=0; i<ctrl.myEvents.length; i++){	
				var __event = {			
					eventTitle: ctrl.myEvents[i].eventTitle,
					eventDescription: ctrl.myEvents[i].eventDescription,
					eventStart: ctrl.myEvents[i].eventStart,
					eventExpectedEnd: ctrl.myEvents[i].eventExpectedEnd,
					eventActualEnd: ctrl.myEvents[i].eventActualEnd,
					eventHasSkills: ctrl.myEvents[i].eventHasSkills,
					eventStatus: ctrl.myEvents[i].eventStatus
				}
				UserSrv.updateEvent(ctrl.myEvents[i].id, __event);
			}
		}

		// Update the Skills to database
		function updateSkillDb(){
			for (var i=0; i<ctrl.mySkills.length; i++){	
				var __skill = {			
					skillName: ctrl.mySkills[i].skillName,
					tokensTotal: ctrl.mySkills[i].tokensTotal,
					skillLevel: ctrl.mySkills[i].skillLevel,
					levelUpDate: ctrl.mySkills[i].levelUpDate
				}
				UserSrv.updateSkill(ctrl.mySkills[i].id, __skill);
			}
		}

	}	

})();



