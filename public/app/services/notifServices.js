angular.module('notificationServices', [])

.factory('Notifications', function(){
  notificationFactory ={};
  notificationFactory.showNotification = function(level, message, title){
  toastr.options = {
   "closeButton": false,
   "debug": false,
   "newestOnTop": true,
   "progressBar": true,
   "positionClass": "toast-top-center",
   "preventDuplicates": false,
   "onclick": null,
   "showDuration": "7000",
   "hideDuration": "1000",
   "timeOut": "5000",
   "extendedTimeOut": "1000",
   "showEasing": "swing",
   "hideEasing": "linear",
   "showMethod": "fadeIn",
   "hideMethod": "fadeOut"
  };
    toastr[level](message, title);
  }


  notificationFactory.showLeagueCode = function(level, message, title){
  toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-full-width",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "0",
    "hideDuration": "0",
    "timeOut": "0",
    "extendedTimeOut": "0",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut",
    "tapToDismiss": false
  };
    toastr[level](message, title);
  }



  return notificationFactory;
});
