angular.module('userControllers',['userServices','notificationServices'])

.controller('declCtrl', function($http,$location, $timeout, User, Notifications){
  var app = this;
  this.regDeclaration = function(declData, valid, pristine) {
      app.loading = true;
      app.successMsg = false;
      app.errorMsg = false;
    console.log(declData);
    User.submitDeclaration(declData).then(function(data){
      if(data.data.success){
          app.loading = false;
        app.successMsg = data.data.message;
          Notifications.showNotification('success',app.successMsg,'The Big Whammy');
          $timeout(function() {
              $location.path('/');
          }, 4000);
      }else{
          app.loading = false;
          //create an error message
          app.errorMsg = data.data.message;
          Notifications.showNotification('error',app.errorMsg,'The Big Whammy');
      }
    });
  }
})

.controller('regCtrl', function($http, $location, $timeout, User, Notifications) {

  var app = this;

  this.regUser = function(regData, valid, pristine) {
    app.loading = true;
    app.successMsg = false;
    app.errorMsg = false;


    if(valid) {
      this.regData.dob = new Date(this.regData.dob).getTime();
      User.create(app.regData).then(function(data){

        if(data.data.success){
          app.loading = false;
          //create success message and return to home page
          app.successMsg = data.data.message;
          Notifications.showNotification('success',app.successMsg,'The Big Whammy');
          $timeout(function() {
            $location.path('/');
          }, 4000);
        }else{
          app.loading = false;
          //create an error message
          app.errorMsg = data.data.message;
          Notifications.showNotification('error',app.errorMsg,'The Big Whammy');
        }
      });
    } else{
      if(pristine){
        app.loading = false;
        //create an error message
        app.errorMsg = 'Please ensure form is filled';
        Notifications.showNotification('error',app.errorMsg,'The Big Whammy');
      }
    }

  };

  //checkUsername(regData);
  this.checkUsername = function(regData){

      app.checkingUsername = true;
      app.usernameMsg = false;
      app.usernameInvalid = false;

      User.checkUsername(app.regData).then(function(data){
        if(data.data.success) {
          app.checkingUsername = false;
          app.usernameInvalid = false;
          app.usernameMsg = data.data.message;
        }else{
          app.checkingUsername = false;
          app.usernameInvalid = true;
          app.usernameMsg = data.data.message;
        }
      });
  }

  this.checkMobilenumber = function(regData){

      app.checkingContactnum = true;
      app.contactnumMsg = false;
      app.contactnumInvalid = false;

      User.checkMobilenumber(app.regData).then(function(data){
        if(data.data.success) {
          app.checkingContactnum = false;
          app.contactnumInvalid = false;
          app.contactnumMsg = data.data.message;
        }else{
          app.checkingContactnum = false;
          app.contactnumInvalid = true;
          app.contactnumMsg = data.data.message;
        }
      });
  }

  this.checkEmail = function(regData){
    app.checkingEmail = true;
    app.emailMsg = false;
    app.emailInvalid = false;

      User.checkEmail(app.regData).then(function(data){
        if(data.data.success) {
          app.checkingEmail = false;
          app.emailInvalid = false;
          app.emailMsg = data.data.message;
        }else{
          app.checkingEmail = false;
          app.emailInvalid = true;
          app.emailMsg = data.data.message;
        }
      });
    }
})

.directive('match', function() {
  return {
    restrict: 'A',
    controller:function($scope){
      $scope.doConfirm = function(values) {
        values.forEach(function(ele){

          $scope.confirmed = false;
          if($scope.confirm == ele) {
            $scope.confirmed = true;
          }else{
            $scope.confirmed = false;
          }

        });
      }
    },

    link: function(scope, element, attrs) {

      attrs.$observe('match', function(){
        scope.matches = JSON.parse(attrs.match);
        scope.doConfirm(scope.matches);
      });

      scope.$watch('confirm', function(){
        scope.matches = JSON.parse(attrs.match);
        scope.doConfirm(scope.matches);
      });


    }

  };
})

//router.post('/users', function(req, res){
