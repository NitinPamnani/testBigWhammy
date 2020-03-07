angular.module('instamojoCheckout', ['userServices','notificationServices'])

.factory('InstaCheckout', function(User, Notifications, $route){
  instaMojoFactory ={};

  instaMojoFactory.makeInstaPurchase = function(){
    function onInstaOpenHandler () {
           console.log('Payments Modal is Opened');
         }

         function onCloseHandler () {
           console.log('Payments Modal is Closed');
           $route.reload();
         }

         function onPaymentSuccessHandler (response) {
           User.updateInstaPaymentOptions(response.paymentId);
           Notifications.showLeagueCode('info',"Your payment was successful. Click on 'ENTER THE BIG WHAMMY LEAGUE' button under CEO's message.",'Thank you for joining The Big Whammy 2018-2019.');
           console.log('Payment Success Response', response);
         }

         function onPaymentFailureHandler (response) {

         }
         /* End client-defined Callback Handler Functions */

         /* Configuring Handlers */
         Instamojo.configure({
           handlers: {
             onOpen: onInstaOpenHandler,
             onClose: onCloseHandler,
             onSuccess: onPaymentSuccessHandler,
             onFailure: onPaymentFailureHandler
           }
         });

       //Instamojo.open("https://test.instamojo.com/@nitinpamnani002/lcc23016dd1ac43bb9a4ab860d1081b64/");
      Instamojo.open("https://www.instamojo.com/@thebigwhammy/lf3367ba89a1649349cd13dd9c7196a4d/");
      //Instamojo.open("https://imjo.in/AKqJ3z");

    
  }



  return instaMojoFactory;
});
