angular.module('userControllers',['userServices'])

.controller('regCtrl', function($http, $location, $timeout, User) {

  var app = this;

  this.regUser = function(regData, valid) {
    app.loading = true;
    app.successMsg = false;
    app.errorMsg = false;
    this.regData.dob = new Date(this.regData.dob).getTime();

    if(valid) {
      User.create(app.regData).then(function(data){

        if(data.data.success){
          app.loading = false;
          //create success message and return to home page
          app.successMsg = data.data.message;
          $timeout(function() {
            $location.path('/');
          }, 2000);
        }else{
          app.loading = false;
          //create an error message
          app.errorMsg = data.data.message;
        }
      });
    } else{
      app.loading = false;
      //create an error message
      app.errorMsg = 'Please ensure form is filled out properly';
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
