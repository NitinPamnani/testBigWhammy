angular.module('mainController',['authServices', 'userServices','notificationServices'])
//This contoller is going to maintain the logged in state
// of the user hence injecting it onto index
.controller('mainCtrl', function(Auth, $timeout, $location, $rootScope, User, $route, Notifications) {
    var app =this;

    app.loadme= false;

    $rootScope.$on('$routeChangeStart', function(){

      if(Auth.isLoggedIn()) {
        app.isLoggedIn = true;
        Auth.getUser().then(function(data){
          //console.log(data);
          app.fullname = data.data.fullname;
          app.username = data.data.username;
          app.useremail = data.data.email;
          app.loadme = true;
          app.hasPaid = false;
          Auth.hasPaid().then(function(data){
            app.hasPaid = data.data.success;
            //console.log(data);
          });
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
          Notifications.showNotification('success',app.successMsg,'The Big Whammy');
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
            Notifications.showNotification('error',app.errorMsg,'The Big Whammy');
          }else{
            app.loading = false;
            app.disabled = false;
            app.errorMsg = data.data.message
            Notifications.showNotification('error',app.errorMsg,'The Big Whammy');
          }
        }
      });
    };

    this.makepurchase = function(){
      app.openpaymentform = false;
      Auth.makepurchase().then(function(data){
        if(data.data.success){
          app.contactnum = data.data.userdetails.contactnum;
          app.hastopay = data.data.userdetails.hastopay;
          app.openpaymentform = true;
          app.options = {
            "key": "rzp_test_TPs56lLj5TlWtW",
            "amount":  app.hastopay ,
            "name": "The Big Whammy season 2018-19",
            "description": "Entry ticket for the Big Whammy League",
            "image": "http://www.thebigwhammy.com/assets/images/logo.png",
            "handler": function (response){

                User.updatePaymentOptions(response.razorpay_payment_id).then(function(data){
                  app.openpaymentform = false;
                  $timeout(function(){
                    $route.reload();
                  }, 2000);
                });

            },
            "prefill": {
            "name":  app.fullname ,
            "email":  app.useremail,
            "contact":  app.contactnum
            },
            "notes": {
            "remark": "Payment for the big whammy"
            },
            "theme": {
            "color": "#818181"
            }
          };
          if( app.openpaymentform ){
            var rzp1 = new Razorpay(app.options);
            rzp1.open();
          }

        }else{
          app.errorMsg = data.data.message;
          Notifications.showNotification('error',app.errorMsg,'The Big Whammy');
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
