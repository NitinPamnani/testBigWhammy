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
           Notifications.showLeagueCode('info',"We hope you have a fantastic season. Welcome to the most unique fantasy league in the world. Everything is personal. You slip up, and you're run down. You stay focused, you're bound to win something. All the best!!. Here's your league code 1996969-573960",'Thank you for joining The Big Whammy 2018-2019.');
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

       Instamojo.open("https://test.instamojo.com/@nitinpamnani002/lcc23016dd1ac43bb9a4ab860d1081b64/");

  }



  return instaMojoFactory;
});
