angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'ngAnimate', 'mainController', 'authServices', 'notificationServices', 'emailController','instamojoCheckout'])

.config(function($httpProvider){
  $httpProvider.interceptors.push('AuthInterceptors');
});
