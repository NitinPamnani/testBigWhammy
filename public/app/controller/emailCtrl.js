angular.module('emailController', ['userServices','notificationServices'])

  .controller('emailCtrl', function($routeParams, User, $timeout, $location, Notifications) {

    app = this;
    User.activateAccount($routeParams.token).then(function(data){

      app.successMsg = false;
      app.errorMsg = false;


      if(data.data.success){
        app.successMsg = data.data.message+ '...Redirecting';
        Notifications.showNotification('success',app.successMsg,'The Big Whammy');
        $timeout(function(){
          $location.path('/login');
        }, 2000);
      }else {
        app.errorMsg = data.data.message+'...Redirecting';
        Notifications.showNotification('error',app.errorMsg,'The Big Whammy');
        $timeout(function(){
          $location.path('/login');
        }, 2000);
      }
    });
  })

  .controller('resendCtrl', function(User){

      app = this;
      app.checkCredentials = function(loginData) {
        app.errorMsg = false;
        app.successMsg = false;
        app.disabled = true;
          User.checkCredentials(app.loginData).then(function(data){
              if(data.data.success){

                User.resendLink(app.loginData).then(function(data) {
                  if(data.data.success){
                    app.successMsg = data.data.message;
                    Notifications.showNotification('success',app.successMsg,'The Big Whammy');
                  }
                });
              } else {
                app.disabled = true;
                app.errorMsg = data.data.message;
                Notifications.showNotification('error',app.errorMsg,'The Big Whammy');
              }
          });
      };


  });
