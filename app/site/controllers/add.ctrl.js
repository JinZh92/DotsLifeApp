(function(){
  angular
    .module('lifeCalendarApp')
    .controller('ModalInstanceCtrl',ModalInstanceCtrl)

  function ModalInstanceCtrl($scope,$state,UserSrv,$uibModalInstance) {
    var modalVm = this;

    // modalVm.items = cartSrv.items;
    

    modalVm.ok = function () { // checkout function
      console.log ("hello")
     $state.go('checkout');
     $uibModalInstance.dismiss('checkout');
    };

    modalVm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }

})();