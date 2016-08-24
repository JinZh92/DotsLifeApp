(function(){
	'use strict';

	angular
		.module('lifeCalendarApp')
		.controller('UserCtrl',UserCtrl)

	function UserCtrl($state, $element, UserSrv, userResolve, skillsResolve, eventsResolve, $rootScope, toastr, $scope){
		var ctrl = this;

		//check if logged in. If yes, get the userEmail from the authToken
		if (localStorage.authToken == undefined || localStorage.authToken == null){
			$state.go('welcome');
		} else {
			// With resolve, the page is loaded after the email-specific data has already been returned
			ctrl.myData = userResolve;
			ctrl.myEmail = UserSrv.getEmailFromToken; // not working properly. fix later
			ctrl.myEvents = eventsResolve;
			ctrl.mySkills = skillsResolve;
			ctrl.getThisWeek = UserSrv.getThisWeek();

			console.log("resolve: ", ctrl.myData);
		}

		//------------Variable Declaration------------//
		ctrl.myEmail; // User email as string
		ctrl.myData; // User object
		// ctrl.myEvents = UserSrv.getUserEvents(); // array of all user's events
		console.log("controller event:", ctrl.myEvents)
		// ctrl.mySkills = UserSrv.getUserSkills(); // array of all user's skills
		ctrl.displayedEvents = ctrl.myEvents;
		ctrl.announcement = [];
		ctrl.displayStart;
		ctrl.displayEnd;
		ctrl.showDates;

		ctrl.array = UserSrv.getWeeks();

		// Get This Week

		//------------Function Declarations------------//
		ctrl.logout = logout;
		ctrl.thisweekClick = thisweekClick;
		ctrl.overviewClick = overviewClick;
		ctrl.profileClick = profileClick;
		ctrl.managementClick = managementClick;
		ctrl.toAnnouncement = toAnnouncement;
		ctrl.isThisWeek = isThisWeek;
		ctrl.selectDot = selectDot;
		ctrl.isPast = isPast;
		ctrl.isNow = isNow;
		ctrl.showAllEvents = showAllEvents;
		ctrl.addEvent = addEvent;
		ctrl.concludeEvent = concludeEvent;
		ctrl.editEvent = editEvent;
		ctrl.getEventsFromWk = getEventsFromWk;
		ctrl.showIncomplete = showIncomplete;
		ctrl.getProgress = getProgress;
		ctrl.getAnniversary = getAnniversary;
		ctrl.editUser = editUser;
		ctrl.changePassword = changePassword;
		ctrl.addSkill = addSkill;
		ctrl.addSkillToken = addSkillToken;
		ctrl.getSkillName = getSkillName;
		ctrl.levelUp = levelUp;
		ctrl.updateUserDb = updateUserDb;
		ctrl.updateEventDb = updateEventDb;
		ctrl.updateSkillDb = updateSkillDb;
		ctrl.deleteEvent=deleteEvent;
		
		// Clear AuthToken from LocalStorage
		function logout(){
			localStorage.removeItem('authToken');
			localStorage.removeItem('loginEmail');
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
		function managementClick(){
			$state.go('user.management')
		}		
		function profileClick(){
			$state.go('user.profile');
		}
		//-------------thisweek Function-------------//
		ctrl.todoList=[];
		ctrl.todoList.push("Daliy Todos: ");
		ctrl.addTodo = function(todo){			
			if(todo){
				if(ctrl.todoList.length>0){
					if(ctrl.todoList.indexOf(todo)>-1){
						alert("todo exits")
					}
					else{
						ctrl.todoList.push(ctrl.todo);
					}
				}
				else{
					ctrl.todoList.push(ctrl.todo);
				}
			}
		}

		ctrl.deleteTodo = function(todo){
			if(todo){
				if(ctrl.todoList){
					var num=ctrl.todoList.indexOf(todo);
					if(num>-1){
						ctrl.todoList.splice(num,num);
					}
				}	
			}
		}
		ctrl.addOpen = function(e){
			UserSrv.open();
			UserSrv.editingEvent=e;
		}
		ctrl.addEventOpen=function(){
			console.log("controlleriswork");
			UserSrv.openEvent();
		}
		ctrl.myVar=false;
		ctrl.toggle = function() {
        ctrl.myVar = !ctrl.myVar;
    	};
    	ctrl.togglele=function(){
    	ctrl.myVar=false;
    	}
    	ctrl.myVarSkill=false;
		ctrl.toggleSkill = function() {
        ctrl.myVarSkill = !ctrl.myVarSkill;
        console.log("toggoleSkill is clicked")
    	};
    	ctrl.toggleleSkill=function(){
    	ctrl.myVarSkill=false;
    	};

		ctrl.myAdd=false;
		ctrl.toggleAdd = function() {
        ctrl.myAdd = !ctrl.myAdd;
    	};
    	ctrl.toggleleAdd=function(){
    	ctrl.myAdd=false;
    	}
    	ctrl.myEdit=false;
		ctrl.toggleEdit = function() {
        ctrl.myEdit = !ctrl.myEdit;
    	};
    	ctrl.toggleleEdit=function(){
    	ctrl.myEdit=false;
    	}
    	ctrl.activeParentIndex=-1;
    	ctrl.activeChileIndex=-1;
    	ctrl.showKids = function (e,f) {
        ctrl.activeParentIndex = f.indexOf(e)
    	};
    	ctrl.showGrandKids = function (e,f) {
        ctrl.activeChileIndex = f.indexOf(e)
    	};
    	ctrl.myCon=false;
		ctrl.toggleCon = function() {
        ctrl.myCon = !ctrl.myCon;
    	};
    	ctrl.toggleleCon=function(){
    	ctrl.activeParentIndex=-1;
    	}   

    	//-------------Dots Life function------------//	

    	function selectDot(number){
    		console.log(number);
    		$state.go('user.management');
    		ctrl.getEventsFromWk(number, number);
    		ctrl.showDates = true;
    	}

    	function isPast(item){
    		// var id = angular.element(item).data('id');
    		console.log(item);
    		// var id = item.attributes['id'].value;
    		return item < ctrl.getThisWeek;
    	}

    	function isNow(item){
    		console.log(id);
    		// var id = item.attributes['id'].value;
    		return item == ctrl.getThisWeek;
    	}

		//-------------Watcher Function--------------//
		// $scope.$watch(function(){
		// 	return UserSrv.getUserEvents();
		// }, function(newVal){
		// 	ctrl.myEvents = UserSrv.getUserEvents();
		// }, true);

		// $scope.$watch(function(){
		// 	return UserSrv.getUserSkills();
		// }, function(newVal){
		// 	ctrl.mySkills = UserSrv.getUserSkills();
		// }, true);

		//--------------Event Functions--------------//

		// check if en event is before the end of this week, return bool.
		function isThisWeek(event){
			var thisWeekNumber = ctrl.getThisWeek;
			var endTime = ctrl.myData.userBirthday;
			var eventStart = new Date(event.eventStart);
			var weekEnd = new Date(endTime);
			weekEnd.setTime(weekEnd.getTime() + (7*(thisWeekNumber)) * 86400000);
			return eventStart <= weekEnd;
		}

		function showAllEvents(){
			ctrl.displayedEvents = ctrl.myEvents;
			ctrl.showDates = false;
			return ctrl.myEvents;
		}

		function showIncomplete(){
			var incompleteArr = [];
			//TODO return array of envets that are incomplete and scheduled for this week
			ctrl.myEvents.forEach(function(event){
				if (event.eventStatus == 'INCOMPLETE' && ctrl.isThisWeek(event)){
					incompleteArr.push(event);
				}
			})
			return incompleteArr;
		}

		function addEvent(){
			var newEventStart = new Date(ctrl.newEventStart);
			var newEventExpectedEnd = new Date(ctrl.newExpectedEnd);
			var td = new Date(Date.now());
			var newEventSkill = [];
			var newEventStatus = '';
			if (ctrl.newEventSkill!=undefined && ctrl.newEventSkill!=null){
				newEventSkill.push(ctrl.newEventSkill.id);
			} else {
				newEventSkill.push('');
			}

			if (newEventExpectedEnd < td){
				newEventStatus = "COMPLETE";
			} else {
				newEventStatus = "INCOMPLETE";
			}

			var event = {
				userEmail: ctrl.myData.userEmail,
				eventTitle: ctrl.newEventTitle,
				eventDescription: ctrl.newEventDes,
				eventStart: newEventStart,
				eventExpectedEnd: newEventExpectedEnd,
				eventHasSkills: newEventSkill,
				eventStatus: newEventStatus
			}
			// keep the view updated after new creation
			UserSrv.createEvent(event)
				.then(function(){
					return UserSrv.getUserEvents();
				})
				.then(function(res){
					ctrl.myEvents = res;
					ctrl.displayedEvents = res;
					ctrl.showIncomplete();
				});
		}

		function concludeEvent(id){
			//TODO setSpecial/levelUp/setActualEnd/checkFinishedSuccessful/addtoken if successful
			ctrl.myEvents.forEach(function(event){
				if (event.id == id){
					var eventSkillId = event.eventHasSkills[0];
					var eventStatus = '';
					var actualEndDate = new Date(ctrl.setActualEnd);
					var expectedEnd = new Date(event.expectedEnd);
					var eventStart = new Date(event.eventStart);
					if (actualEndDate <= expectedEnd){

						var tokensEarned = Math.ceil((expectedEnd - eventStart)/(1000*3600*24)) + 1;
						ctrl.addSkillToken(eventSkillId, tokensEarned, eventActualEnd);
						toastr.info("Successfully earned " + tokensEarned + " tokens in skill " + ctrl.getSkillName(eventSkillId, ctrl.myEmail));

						if (ctrl.isSpecial){
							eventStatus = 'SPECIAL';
						} else {
							eventStatus = 'COMPLETE';
						}

					} else {
						eventStatus = 'FAIL';
					}

					__event = {
						eventActualEnd: actualEndDate,
						eventStatus: eventStatus
					}
					UserSrv.updateEvent(event.id, __event)
						.then(function(){
							return UserSrv.getUserEvents();
						})
						.then(function(res){
							ctrl.myEvents = res;
							ctrl.displayedEvents = res;
							ctrl.showIncomplete();
						});
				}
			})


		}

		function editEvent(id){
			//TODO: Can edit only when it's incomplete.
			ctrl.myEvents.forEach(function(event){
				if (event.id == id){
					if (event.eventStatus == "INCOMPLETE"){
						var __event = {
							eventTitle: ctrl.editEventTitle,
							eventDescription: ctrl.editEventDes,
							eventStart: ctrl.editEventStart,
							eventExpectedEnd: ctrl.editEventExpected,
							eventHasSkills: [ctrl.editEventHasSkillId]
						}
						UserSrv.updateEvent(id, __event)
							.then(function(){
								return UserSrv.getUserEvents();
							})
							.then(function(res){
								ctrl.myEvsents = res;
								ctrl.displayedEvents = res;
								ctrl.showIncomplete();
							});
					}
				}
			})

		}

		function deleteEvent(id){
			ctrl.myEvents.forEach(function(event){
				if (event.id == id){
					if (event.eventStatus == "INCOMPLETE"){

						// delete and keep the view updated after deletion
						UserSrv.deleteEvent(id)
							.then(function(){
								return UserSrv.getUserEvents();			
							})
							.then(function(res){
								ctrl.myEvents = res;
								ctrl.displayedEvents = res;
								ctrl.showIncomplete();
							});
					}


				}
			})
			
		}

		function getEventsFromWk(start, end){
			//TODO start and end are week
			var st = Math.min(start, end);
			var en = Math.max(start, end);
			var bd = new Date(ctrl.myData.userBirthday);
			console.log("Get events from wk, birthday is: ", bd);

			var startDate = bd.setTime(bd.getTime() + (7*(st-1)) * 86400000);
			startDate = new Date(startDate);
			console.log("Start Date: ", startDate);

			bd = new Date(ctrl.myData.userBirthday);
			var endDate = bd.setTime(bd.getTime() + (7*(en)) * 86400000);
			endDate = new Date(endDate);
			console.log("End Date: ", endDate);

			ctrl.displayStart = startDate;
			ctrl.displayEnd = endDate;

			var eventsBetweenWeeks = [];
			ctrl.myEvents.forEach(function(event){
				var eventStart = new Date(event.eventStart);
				if (eventStart>startDate && eventStart < endDate){
					console.log("Passed checking for get events from weeks!")
					eventsBetweenWeeks.push(event);
				}
			})
			ctrl.displayedEvents = eventsBetweenWeeks;
		}

		function getProgress(event){
			var now = new Date(Date.now());
			var start = new Date(event.eventStart);
			var end = new Date(event.eventExpectedEnd);

			if (now > start && now < end){
				var duration = Math.ceil((end - start)/(1000*3600*24)) + 1;
				var spent = Math.ceil((end - now)/(1000*3600*24));
				// return the percentage progress to 2 decimal places
				return (spent/duration * 100).toFixed(2);
			} else {
				console.log("Event not started yet");
				return 0;
			}	
		}

		function getAnniversary(event){
			var now = new Date(Date.now());
			var end = new Date(event.eventActualEnd);
			// return number of weeks since
			return Math.floor((now - end)/(1000*3600*24*7));

		}

		function toAnnouncement(){
			//TODO: return an array of events that set to special and are 10*k weeks away from now
			// and events with high priority
			ctrl.myEvents.forEach(function(event){
				if (event.eventStatus == "INCOMPLETE"){
					if (ctrl.getProgress(event) >= 80){
						ctrl.announcement.push("The time left for: " + event.eventTitle + " is almost up! Time used: " + ctrl.getProgress(event) + "%");
					}
				}

				if (event.eventStatus == "SPECIAL"){
					var numWk = ctrl.getAnniversary(event)/10;
					if (numWk >= 1 && Number.isInteger(numWk)){
						ctrl.announcement.push("It's been " + (numWk*10) + " weeks since you did: " + event.eventTitle);
					}			
				}
			})
		}


		//--------------User Functions--------------//
		function editUser(){
			ctrl.myData.userFullName = ctrl.userFullName;
			ctrl.myData.userBirthday = ctrl.userBirthday;
			ctrl.updateUserDb();
		}

		function changePassword(){
			if (ctrl.newUserPswd != null && ctrl.newUserPswd !='' && ctrl.newUserPswd == ctrl.newUserPswdRep){
				var user = {
					userEmail: ctrl.myData.userEmail,
					userPswd: ctrl.newUserPswd
				}
				UserSrv.changePassword(ctrl.myData.userEmail, user);
			}
		}

		//--------------Skill Functions--------------//
		function addSkill(){
			var skill = {
				skillName: ctrl.newSkillName,
				userEmail: ctrl.myData.userEmail,
				tokensTotal: 0,
				skillLevel: 0,
				levelUpDate: []
			}

			// keep the view updated after new creation
			UserSrv.createSkill(skill)
				.then(function(){
					return UserSrv.getUserSkills();
				})
				.then(function(res){
					ctrl.mySkills = res;
				});
		}

		function addSkillToken(id, num, date){
			ctrl.mySkills.forEach(function(skill){
				if (skill.id ==  id){
					skill.tokensTotal += num;
					ctrl.levelUp(id, date);
				}
			})
			ctrl.updateSkillDb();
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

		function getSkillName(id, email){
			var skillName = '';
			ctrl.mySkills.forEach(function(skill){
				if (skill.userEmail == email && skill.id == id){
					skillName = skill.skillName;
				}
			})
			return skillName;
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



