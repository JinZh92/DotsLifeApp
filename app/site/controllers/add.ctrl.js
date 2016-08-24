(function(){
  angular
    .module('lifeCalendarApp')
    .controller('ModalInstanceCtrl',ModalInstanceCtrl)

  function ModalInstanceCtrl($scope,$state,UserSrv,userResolve,skillsResolve,eventsResolve,$uibModalInstance,$filter) {
    var modalVm = this;

    modalVm.addSkill=addSkill;
    modalVm.editEvent=editEvent;

    if (localStorage.authToken == undefined || localStorage.authToken == null){
      $state.go('welcome');
    } else {
      // With resolve, the page is loaded after the email-specific data has already been returned
      modalVm.myData = userResolve;
      modalVm.myEmail = UserSrv.getEmailFromToken;
      modalVm.myEvents = eventsResolve;
      modalVm.mySkills = skillsResolve;
      modalVm.getThisWeek = UserSrv.getThisWeek();

      console.log("resolve: ", modalVm.myData);
    }

    //------------Variable Declaration------------//
    modalVm.myEmail; // User email as string
    modalVm.myData; // User object

    modalVm.editingEvent=UserSrv.editingEvent;
    modalVm.mySkills = skillsResolve;
    modalVm.myEvents=eventsResolve;
    if(UserSrv.editingEvent != undefined && UserSrv.editingEvent != null){
      modalVm.editEventDes=modalVm.editingEvent.eventDescription;
      modalVm.myEmail=modalVm.editingEvent.userEmail;
      modalVm.id=modalVm.editingEvent.id;
    }
    modalVm.addEvent=addEvent;
    modalVm.displayedEvents = modalVm.myEvents;
    function addEvent(){
      var newEventStart = new Date(modalVm.newEventStart);
      var newEventExpectedEnd = new Date(modalVm.newExpectedEnd);
      var td = new Date(Date.now());
      var newEventSkill = [];
      var newEventStatus = '';
      if (modalVm.newEventSkill.id!=undefined && modalVm.newEventSkill.id!=null){
        newEventSkill.push(modalVm.newEventSkill.id);
      } else {
        newEventSkill.push('');
      }

      if (newEventExpectedEnd < td){
        newEventStatus = "COMPLETE";
      } else {
        newEventStatus = "INCOMPLETE";
      }

      var event = {
        userEmail: modalVm.myData.userEmail,
        eventTitle: modalVm.newEventTitle,
        eventDescription: modalVm.newEventDes,
        eventStart: newEventStart,
        eventExpectedEnd: newEventExpectedEnd,
        eventHasSkills: newEventSkill,
        eventStatus: newEventStatus
      }
      UserSrv.createEvent(event);

      UserSrv.getUserEvents()
        .then(function(res){
          modalVm.myEvents = res;
          modalVm.displayedEvents = res;
        });
      modalVm.cancel();
    }

    modalVm.myVarSkill=false;
    modalVm.toggleSkill = function() {
      modalVm.myVarSkill = !modalVm.myVarSkill;
        console.log("toggoleSkill is clicked")
    };
    modalVm.toggleleSkill=function(){
      modalVm.myVarSkill=false;
    };

    function addSkill(){
      var skill = {
        skillName: modalVm.newSkillName,
        userEmail: modalVm.myEmail,
        tokensTotal: 0,
        skillLevel: 0,
        levelUpDate: []
      }
      UserSrv.createSkill(skill);
      // ctrl.toggleleSkill();
      console.log("edit submit");
    }


    function editEvent(id){
      //TODO: Can edit only when it's incomplete.
      console.log(id);
      modalVm.myEvents.forEach(function(event){
        console.log(event);
        if (event.id == id){
          if (event.eventStatus == "INCOMPLETE"){
            var __event = {
              eventTitle: modalVm.editEventTitle,
              eventDescription: modalVm.editEventDes,
              eventStart: modalVm.editEventStart,
              eventExpectedEnd: modalVm.editEventExpected,
              // eventHasSkills: [modalVm.editEventHasSkillId]
              eventHasSkills: modalVm.editEventHasSkillId
            }
            UserSrv.updateEvent(id, __event);
          }
        }
      })

    }

    modalVm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
    // modalVm.ok = function () { // checkout function
    //   console.log ("hello")
    //  $state.go('checkout');
    //  $uibModalInstance.dismiss('checkout');
    // };
  }

})();