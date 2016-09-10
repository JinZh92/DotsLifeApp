(function(){
	'use strict';

	angular
		.module('lifeCalendarApp')
		.controller('UserCtrl',UserCtrl)

	function UserCtrl($state, $interval, UserSrv, userResolve, skillsResolve, eventsResolve, $rootScope, toastr, $scope){
		var ctrl = this;

		//------------Variable Declaration------------//
		ctrl.myEmail; 			// User email as string
		ctrl.myData; 			// User object
		ctrl.displayedEvents 	= ctrl.myEvents;
		ctrl.displayStart;
		ctrl.displayEnd;
		ctrl.showDates;
		ctrl.announcementIndex 	= 0;


		// console.log('User resolve:', userResolve);

		ctrl.array 				= UserSrv.getWeeks();

		//------------Function Declarations------------//
		ctrl.logout 			= logout;
		ctrl.thisweekClick  	= thisweekClick;
		ctrl.overviewClick 		= overviewClick;
		ctrl.profileClick 		= profileClick;
		ctrl.managementClick 	= managementClick;
		ctrl.trackClick 		= trackClick;

		ctrl.toAnnouncement 	= toAnnouncement;
		ctrl.nextAnnouncement 	= nextAnnouncement;
		ctrl.isThisWeek 		= isThisWeek;
		ctrl.selectDot 			= selectDot;
		ctrl.showAllEvents 		= showAllEvents;
		ctrl.addEvent 			= addEvent;
		ctrl.concludeEvent 		= concludeEvent;
		ctrl.editEvent 			= editEvent;
		ctrl.getEventsFromWk	= getEventsFromWk;
		ctrl.showIncomplete 	= showIncomplete;
		ctrl.getProgress 		= getProgress;
		ctrl.getAnniversary 	= getAnniversary;
		ctrl.editUser 			= editUser;
		ctrl.changePassword 	= changePassword;
		ctrl.addSkill 			= addSkill;
		ctrl.addSkillToken 		= addSkillToken;
		ctrl.getSkillName 		= getSkillName;
		ctrl.levelUp 			= levelUp;
		ctrl.updateUserDb 		= updateUserDb;
		ctrl.updateEventDb 		= updateEventDb;
		ctrl.updateSkillDb 		= updateSkillDb;
		ctrl.deleteEvent		= deleteEvent;
		ctrl.getSkillnLevel 	= getSkillnLevel;


		//check if logged in. If yes, get the userEmail from the authToken
		if (localStorage.authToken == undefined || localStorage.authToken == null){
			$state.go('welcome');
		} else {
			// With resolve, the page is loaded after the email-specific data has already been returned
			ctrl.myData 		= userResolve;
			ctrl.myEmail 		= UserSrv.getEmailFromToken; // not working properly. fix later
			ctrl.myEvents 		= eventsResolve;
			ctrl.mySkills 		= skillsResolve;
			ctrl.getThisWeek 	= UserSrv.getThisWeek();
			ctrl.showAllEvents();
			ctrl.announcements 	= ctrl.toAnnouncement();
			ctrl.skillnlevel 	= getSkillnLevel();


			// console.log("Announcement:", ctrl.announcements);
			// console.log("resolve: ", ctrl.mySkills);
		}
		


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
		function trackClick(){
			$state.go('user.track');
		}
		//-------------thisweek Function-------------//

		ctrl.todoList		= [];
		ctrl.todoList.push("Scratch Board: ");
		ctrl.addTodo 		= function(todo){			
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

		ctrl.deleteTodo 	= function(todo){
			if(todo){
				if(ctrl.todoList){
					var num = ctrl.todoList.indexOf(todo);
					if(num > -1){
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
    	ctrl.toggleleGrand=function(){
    	ctrl.activeChileIndex=-1;
    	}   
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

		//-------------Timeout Functions--------------//

		function nextAnnouncement(){
			ctrl.announcementIndex =  (ctrl.announcementIndex + 1)%(ctrl.toAnnouncement().length);
			// console.log("current announcementIndex", ctrl.announcementIndex);
		}

		$interval(function(){
			ctrl.nextAnnouncement();
		}, 4500);
		

		//--------------Event Functions--------------//

		// check if en event is before the end of this week, return bool.
		function isThisWeek(event){
			var thisWeekNumber 	= ctrl.getThisWeek;
			var endTime 		= ctrl.myData.userBirthday;
			var eventStart 		= new Date(event.eventStart);
			var weekEnd 		= new Date(endTime);
			weekEnd.setTime(weekEnd.getTime() + (7*(thisWeekNumber)) * 86400000);
			return eventStart 	<= weekEnd;
		}

		function showAllEvents(){
			ctrl.displayedEvents 	= ctrl.myEvents;
			ctrl.showDates 			= false;
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
			var newEventStart 		= new Date(ctrl.newEventStart);
			var newEventExpectedEnd = new Date(ctrl.newExpectedEnd);
			var td 					= new Date(Date.now()); 
			td.setTime(td.getTime() - (1 * 86400000)); // - 1 day from td.
			var newEventSkill 		= [];
			var newEventStatus 		= '';

			if (ctrl.newEventSkill!=undefined && ctrl.newEventSkill!=null){
				newEventSkill.push(ctrl.newEventSkill.id);
			} else {
				newEventSkill.push('');
			}

			console.log("due date:", newEventExpectedEnd);
			console.log("td ", td);
			console.log(newEventExpectedEnd < td);

			if (newEventExpectedEnd < td){
				console.log("creating complete event, due date:", newEventExpectedEnd);
				console.log("creating complete event, td ", td);
				newEventStatus = "COMPLETE";
			} else {
				console.log("creating incomplete event")
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
					var eventSkillId 	= event.eventHasSkills[0];
					var eventStatus 	= '';
					var actualEndDate 	= new Date(ctrl.setActualEnd);
					var expectedEnd 	= new Date(event.eventExpectedEnd);
					var eventStart 		= new Date(event.eventStart);
					console.log("Concluding event: ")
					console.log("event actual end date: ", actualEndDate);
					console.log("event due date: ", expectedEnd);

					if (actualEndDate <= expectedEnd){
						console.log("event passed");
						var tokensEarned 	= Math.ceil((expectedEnd - eventStart)/(1000*3600*24)) + 1;
						ctrl.addSkillToken(eventSkillId, tokensEarned, expectedEnd);
						toastr.info("Successfully earned " + tokensEarned + " tokens in skill " + ctrl.getSkillName(eventSkillId, ctrl.myData.userEmail));

						if (ctrl.isSpecial){
							eventStatus 	= 'SPECIAL';
						} else {
							eventStatus 	= 'COMPLETE';
						}

					} else {
						console.log("event failed")
						toastr.info("Unfortunately, you failed the event. :(")
						eventStatus = 'FAIL';
					}

					var __event = {
						eventActualEnd: actualEndDate,
						eventStatus: eventStatus
					}

					//update view
					UserSrv.updateEvent(event.id, __event)
						.then(function(){
							return UserSrv.getUserEvents();
						})
						.then(function(res){
							ctrl.myEvents = res;
							ctrl.displayedEvents = res;
							ctrl.showIncomplete();
							return UserSrv.getUserSkills();
						})
						.then(function(res){
							ctrl.mySkills = res;
						})
				}
			})

			ctrl.toggleleGrand();

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
								ctrl.myEvsents 			= res;
								ctrl.displayedEvents 	= res;
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
								ctrl.myEvents 			= res;
								ctrl.displayedEvents 	= res;
								ctrl.showIncomplete();
							});
					}


				}
			})
			
		}

		function getEventsFromWk(start, end){
			//start and end are week number
			var st 	= Math.min(start, end);
			var en 	= Math.max(start, end);
			var bd 	= new Date(ctrl.myData.userBirthday);
			console.log("Get events from wk, birthday is: ", bd);

			var startDate 	= bd.setTime(bd.getTime() + (7*(st-1)) * 86400000);
			startDate 		= new Date(startDate);
			console.log("Start Date: ", startDate);

			bd 			= new Date(ctrl.myData.userBirthday);
			var endDate = bd.setTime(bd.getTime() + (7*(en)) * 86400000);
			endDate 	= new Date(endDate);
			console.log("End Date: ", endDate);

			ctrl.displayStart 	= startDate;
			ctrl.displayEnd 	= endDate;

			var eventsBetweenWeeks = [];
			ctrl.myEvents.forEach(function(event){
				var eventStart = new Date(event.eventStart);
				if (eventStart>startDate && eventStart < endDate){
					console.log("Passed checking for get events from weeks!")
					eventsBetweenWeeks.push(event);
				}
			})
			ctrl.displayedEvents = eventsBetweenWeeks;
			return eventsBetweenWeeks;
		}

		function getProgress(event){
			var now 	= new Date(Date.now());
			var start 	= new Date(event.eventStart);
			var end 	= new Date(event.eventExpectedEnd);

			if (now > start && now < end){
				var duration 	= Math.ceil((end - start)/(1000*3600*24)) + 1;
				var spent 		= Math.ceil((now - start)/(1000*3600*24));
				// return the percentage progress to 2 decimal places
				return (spent/duration * 100).toFixed(2);
			} else {
				// console.log("Event not started yet");
				return 0;
			}	
		}

		function getAnniversary(event){
			//TODO FIX THIS FUNCTION
			var now = new Date(Date.now());
			var end = new Date(event.eventActualEnd);
			// return number of weeks since
			return Math.floor((now - end)/(1000*3600*24*7));

		}

		function toAnnouncement(){
			//TODO: return an array of events that set to special and are 10*k weeks away from now
			// and events with high priority
			var announcement = ["Did you know: It takes about 4433 weeks to waste 85 years."];
			// console.log("generating to announcement");
			ctrl.myEvents.forEach(function(event){
				if (event.eventStatus == "INCOMPLETE"){
					if (ctrl.getProgress(event) >= 75){
						announcement.push("Time for event: " + event.eventTitle + ", is almost up! Time spent: " + ctrl.getProgress(event) + "%.");
					}
				}

				//TODO FIX THIS FUNCTION
				if (event.eventStatus == "SPECIAL"){
					// console.log("testing special")
					var numWk = ctrl.getAnniversary(event)/10;
					// console.log("10 * " + numWk + "weeks since that event")
					if (numWk >= 1 && Number.isInteger(numWk)){
						announcement.push("It's been " + (numWk*10) + " weeks since you did: " + event.eventTitle);
					}			
				}
			})
			return announcement;
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
					userEmail: 	ctrl.myData.userEmail,
					userPswd: 	ctrl.newUserPswd
				}
				UserSrv.changePassword(ctrl.myData.userEmail, user);
			}
		}

		//--------------Skill Functions--------------//
		function addSkill(){
			var skill = {
				skillName: 		ctrl.newSkillName,
				userEmail: 		ctrl.myData.userEmail,
				tokensTotal: 	0,
				skillLevel: 	0,
				levelUpDate: 	[]
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
			console.log("trying to level up a skill")
			for (var i=0; i<ctrl.mySkills.length; i++){
				if (ctrl.mySkills[i].id == id){
					var currentLevel = ctrl.mySkills[i].skillLevel;
					var tokensNeeded = Math.floor(2 * (Math.log(currentLevel+1) / Math.log(3)) + 3);
					console.log("current level is", currentLevel);
					console.log("tokens needed for next level up is: ", tokensNeeded);
					console.log("current total tokens in that skill: ", ctrl.mySkills[i].tokensTotal);
					if (ctrl.mySkills[i].tokensTotal >= tokensNeeded){
						ctrl.mySkills[i].skillLevel += 1;
						ctrl.mySkills[i].tokensTotal -= tokensNeeded;
						ctrl.mySkills[i].levelUpDate.push(date);
						ctrl.levelUp(id, date);
						toastr.info("Congratulations! Your skill: " + ctrl.mySkills[i].skillName + " just leveled up!")
					} else {
						console.log("Not enough tokens to do another level up.")
					}
				}
			}
		}

		function getSkillName(id, email){
			var skillName = '';
			ctrl.mySkills.forEach(function(skill){
				if (skill.userEmail == email && skill.id == id){
					skillName = skill.skillName;
					// console.log("getting skill name:", skillName)
				}
			})
			return skillName;
		}


		//------------Update Data in Controller to DB------------//

		// Update the User data to database
		function updateUserDb(){
			var __user = {			
				userFullName: 	ctrl.myData.userFullName,
				userBirthday: 	ctrl.myData.userBirthday,
				currEvents: 	ctrl.myData.currEvents
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

	//---------------Track functions (charts)------------//

		function getSkillnLevel(){
			ctrl.skillnlevel = [];
			ctrl.mySkills.forEach(function(skill){
				ctrl.skillnlevel.push({key: skill.skillName, y: skill.skillLevel})
			});
			console.log("Getting skill and level");
			return ctrl.skillnlevel;
		}

		ctrl.options1 = {
            chart: {
                type: 'pieChart',
                height: 500,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,
                duration: 500,
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };

        // ctrl.data1 = [
        //     {
        //         key: "AngularJs",
        //         y: 10
        //     },
        //     {
        //         key: "Sleep",
        //         y: 8
        //     },
        //     {
        //         key: "Eat",
        //         y: 2
        //     },
        //     {
        //         key: "Love",
        //         y: 3
        //     },
        //     {
        //         key: "Dream",
        //         y: 9
        //     },
        //     {
        //         key: "Bug Fixing",
        //         y: 4
        //     },
        //     {
        //         key: "Procrastination",
        //         y: 1
        //     }
        // ];


	}	
})();



