angular.module('userServices', [])

.factory('User', function($http) {
  userFactory = {};

  //User.create(regData)
  userFactory.create = function(regData) {
    return $http.post('/api/users', regData);
  }

  //User.checkUsername(regData);
  userFactory.checkUsername = function(regData) {
    return $http.post('/api/checkusername', regData);
  }

  //User.checkEmail(regData);
  userFactory.checkEmail = function(regData) {
    return $http.post('/api/checkemail', regData);
  }

  //User.activateAccount(token);
  userFactory.activateAccount = function(token) {
    return $http.put('/api/activate/'+token);
  }

  //User.checkCredentials(loginData)
  userFactory.checkCredentials = function(loginData){
    return $http.post('/api/resend', loginData);
  }

  //User.resendLink(username);
  userFactory.resendLink = function(username){
    return $http.put('/api/resend', username);
  }

  //User.updatePaymentOptions(username, razorpayid)
  userFactory.updatePaymentOptions = function(razorpayId){
    return $http.post('/api/rzupdate', {razorpayId});
  }

  //User.updateInstaPaymentOptions(instaMojoId)
  userFactory.updateInstaPaymentOptions = function(instaMojoId){
    return $http.post('/api/rzupdate', {instaMojoId});
  }
  //User.checkMobilenumber
  userFactory.checkMobilenumber = function(regData) {
    return $http.post('/api/checkmobilenumber', regData);
  }
  //User.
  return userFactory;
});
