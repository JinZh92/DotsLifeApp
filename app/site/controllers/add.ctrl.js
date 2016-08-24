(function(){
  angular
    .module('lifeCalendarApp')
    .controller('ModalInstanceCtrl',ModalInstanceCtrl)

  function ModalInstanceCtrl($scope,$state,UserSrv,skillsResolve,eventsResolve,$uibModalInstance,$filter) {
    var modalVm = this;

    modalVm.addSkill=addSkill;
    modalVm.editEvent=editEvent;

    // modalVm.items = cartSrv.items;
    
    modalVm.editingEvent=UserSrv.editingEvent;
    modalVm.mySkills = skillsResolve;
    modalVm.myEvents=eventsResolve;
    modalVm.editEventDes=modalVm.editingEvent.eventDescription;
    modalVm.myEmail=modalVm.editingEvent.userEmail;
    modalVm.id=modalVm.editingEvent.id;
    // modalVm.time=new Date(modalVm.editingEvent.eventExpectedEnd);
    // modalVm.editingEvent.eventExpectedEnd = $filter('date')(modalVm.editingEvent.eventExpectedEnd, "yyyy-mm-dd");
    // modalVm.dateAsDate = new Date(modalVm.editingEvent.eventExpectedEnd);
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