var app = angular.module('appRoutes',['ngRoute'])

.config(function($routeProvider, $locationProvider){

  $routeProvider

  .when('/',{
    templateUrl: 'app/views/pages/home.html'
  })

  .when('/about',{
    templateUrl:'app/views/pages/about.html',
    authenticated: true
  })

  .when('/register',{
    templateUrl:'app/views/pages/users/register.html',
    controller: 'regCtrl',
    controllerAs: 'register',
    authenticated: false
  })

  .when('/login',{
    templateUrl:'app/views/pages/users/login.html',
    authenticated: false
  })

  .when('/prizes',{
    templateUrl:'app/views/pages/prizes.html'
  })

  .when('/masterminds',{
    templateUrl:'app/views/pages/masterminds.html'
  })

  .when('/ourjourney',{
    templateUrl:'app/views/pages/ourjourney.html'
  })

  .when('/rules', {
    templateUrl:'app/views/pages/rules.html'
  })

  .when('/quotes', {
    templateUrl:'app/views/pages/quotes.html'
  })

  .when('/logout',{
    templateUrl: 'app/views/pages/users/logout.html',
    authenticated: true
  })

  .when('/profile', {
    templateUrl: 'app/views/pages/users/profile.html',
    authenticated: true

  })

  .when('/activate/:token', {
    templateUrl: 'app/views/pages/users/activation/activate.html',
    controller: 'emailCtrl',
    controllerAs: 'email'
  })

  .when('/resend', {
    templateUrl: 'app/views/pages/users/activation/resend.html',
    controller:'resendCtrl',
    controllerAs:'resend'
  })

  .otherwise({ redirectTo: '/'});

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
});

app.run(['$rootScope','Auth', '$location',function($rootScope, Auth, $location){
  $rootScope.$on('$routeChangeStart',function(event, next, current){
    if(next.$$route.authenticated == true){
      if(!Auth.isLoggedIn()){
        event.preventDefault();
        $location.path('/')

      }
    } else if (next.$$route.authenticated == false){
      if(Auth.isLoggedIn()){
        event.preventDefault();
        $location.path('/profile');
      }
    }
  });
}]);
