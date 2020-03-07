angular.module('authServices', [])

.factory('Auth', function($http, AuthToken) {
  var authFactory = {};

  //User.create(loginData)
  authFactory.login = function(loginData) {
    return $http.post('/api/authenticate', loginData).then(function(data) {
      AuthToken.setToken(data.data.token)
      return data;
    });
  };

  //Auth.isLoggedIn();
  authFactory.isLoggedIn = function() {
    if(AuthToken.getToken()){
      return true;
    }else{
      return false;
    }
  };

  authFactory.haspaid2019 = function() {
    return $http.post('/api/entrygranted');
  };

  authFactory.agreesToPay2019 = function() {
        return $http.post('/api/isdeclarationfilled');
  };

    authFactory.hasjoinedleagues2019 = function() {
        return $http.post('/api/hasjoined2019');
    };

  authFactory.getUser = function() {
    if(AuthToken.getToken()){
      return $http.post('/api/me');
    }else {
      $q.reject({message: 'User has no token'});
    }
  };
  //Auth.logout
  authFactory.logout = function() {
    AuthToken.setToken();
  };

  //Auth.makepurchase
  authFactory.makepurchase = function() {
    return $http.post('/api/rzpay');
  };

  return authFactory;
})

.factory('AuthToken', function($window) {
  var authTokenFactory = {};

  //AuthToken.setToken(token);
  authTokenFactory.setToken = function(token){
    if(token){
      $window.localStorage.setItem('token', token);
    } else{
      $window.localStorage.removeItem('token');
    }
  }

  //AuthToken.getToken();
  authTokenFactory.getToken = function(){
    return $window.localStorage.getItem('token');
  }

  return authTokenFactory;
})

.factory('AuthInterceptors', function(AuthToken) {
  var authInterceptorFactory = {};

  authInterceptorFactory.request = function(config) {

    var token = AuthToken.getToken();

    if(token){
      config.headers['x-access-token'] = token;
    }

    return config;
  };

  return authInterceptorFactory;
})
