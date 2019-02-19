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

   userFactory.sendUsername = function(userData){
    return $http.get('/api/fetchusername/' + userData);
   }

   userFactory.sendPassword = function(resetData){
     return $http.put('/api/resetpassword', resetData);
   }

   userFactory.resetUser = function(token){
    return $http.get('/api/resetpassword/'+token);
   }

   userFactory.savePassword = function(regData){
    return $http.put('/api/savepassword', regData);
   }



        //User.
  return userFactory;
});
