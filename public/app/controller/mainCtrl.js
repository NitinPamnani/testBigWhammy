angular.module('mainController',['authServices'])
//This contoller is going to maintain the logged in state
// of the user hence injecting it onto index
.controller('mainCtrl', function(Auth, $timeout, $location, $rootScope) {
    var app =this;

    app.loadme= false;

    $rootScope.$on('$routeChangeStart', function(){
      if(Auth.isLoggedIn()) {
        app.isLoggedIn = true;
        Auth.getUser().then(function(data){
          app.username = data.data.username;
          app.useremail = data.data.email;
          app.loadme = true;
        });
      }else {
        app.isLoggedIn = false;
        app.username = '';
        app.loadme = true;
      }
    });



    this.doLogin = function(loginData) {
      app.loading = true;
      app.successMsg = false;
      app.errorMsg = false
      app.expired = false;
      app.disabled = true;

      Auth.login(app.loginData).then(function(data){
        if(data.data.success){
          app.loading = false;
          //create success message and return to home page
          app.successMsg = data.data.message;
          $timeout(function() {
            $location.path('/about');
            app.loginData = '';
            app.successMsg = false;
          }, 2000);
        }else{
          if(data.data.expired){
            app.loading = false;
            app.expired = true;
            //create an error message
            app.errorMsg = data.data.message;
          }else{
            app.loading = false;
            app.disabled = false;
            app.errorMsg = data.data.message
          }
        }
      });
    };

    this.logout = function() {
      Auth.logout();
      $location.path('/logout');
      $timeout(function(){
        $location.path('/');
      }, 2000);

      };

});
