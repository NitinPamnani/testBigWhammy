var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = "EmondaLove@2019";
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
//var dumper = require('dumper').dumper;

module.exports = function(router) {



var options = {
  auth: {
    api_user: 'nitin2n33',
    api_key: 'nitin2n33_2'
  }
}

//var client = nodemailer.createTransport(sgTransport(options));
var client = nodemailer.createTransport({
  host: 'smtpout.asia.secureserver.net',
  port: 465,
  secure: true,
  auth: {
    user: 'info@thebigwhammy.com',
    pass: 'TheBigWhammy@123'
  }
});


  //TO ACCESS- http://localhost:<port>/api/users
  //Registraion route
  router.post('/users', function(req, res){

    var user = new User();
    user.fullname = req.body.fullname;
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    user.favclub = req.body.favclub;
    user.dob = req.body.dob;
    user.refferedby = req.body.refferedby;
    user.contactnum = req.body.contactphone;
    user.country = req.body.country;
    user.temporarytoken = jwt.sign({fullname:user.fullname, username: user.username, email: user.email}, secret, {expiresIn: '24h' });

    if (req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == ''){
      res.json({success: false, message:'Ensure username, email and password were provided'});
    }else{


      user.save(function(err){
        if(err){
          console.log(err);
          if(err.errors != null){
            if(err.errors.fullname){
                res.json({success: false, message: err.errors.fullname.message });
            }else if(err.errors.email){
                res.json({success: false, message: err.errors.email.message });
            }else if(err.errors.username){
              res.json({success: false, message: err.errors.username.message });
            }else if(err.errors.password){
              res.json({success: false, message: err.errors.password.message });
            } else{
              res.json({success:false, message: err});
            }
          }else if(err){
            console.log(err);
            if(err.code == 11000) {
              if(err.errmsg[61] == "u"){
                res.json({success:false, message:'Username already taken'});
              }else if(err.errmsg[61] == "e"){
                res.json({success:false, message:'email already taken'});
              }
            }else{
              res.json({success:false, message:err});
            }
          }
        }else{

          var email = {
            from: 'The Big Whammy Team, info@thebigwhammy.com',
            to: user.email,
            subject: 'The Big Whammy account activation link',
            text: 'Hello' + user.fullname + 'Thank you for registering at The Big Whammy. Please click on the following to complete the activation: http://www.thebigwhammy.com/activate/'+user.temporarytoken,
            html: 'Hello <strong>' + user.fullname + '</strong>,<br><br>Username: <strong>'+ user.username +'</strong><br><br> Thank you for registering at The Big Whammy. Please click the link below to complete the activation:<br><a href="http://www.thebigwhammy.com/activate/'+user.temporarytoken+'">http://www.thebigwhammy.com/activate/</a>'
          };

          client.sendMail(email, function(err, info){
              if (err){
                console.log(err);
              }
              else {
                console.log('Message sent: ' + info.response);
              }
          });


          res.json({success:true, message:'Account registered! Please check your email for activation link.'});
        }
      });
    }
  });


  router.post('/checkusername', function(req, res){
    User.findOne({ username: req.body.username}).select('username').exec(function(err,user) {
      if (err) throw err;

      if(user) {
        res.json({ success: false, message: 'That username is already taken' });
      } else{
        res.json({ success: true, message: 'Valid username' });
      }

    });
  });

  router.post('/checkmobilenumber', function(req, res){
    User.findOne({ contactnum: req.body.contactphone}).select('contactnum').exec(function(err,user) {
      console.log(req.body.contactphone);
      if (err) throw err;

      if(user) {
        res.json({ success: false, message: 'That Contactnumber is already registered' });
      } else{
        res.json({ success: true, message: 'Valid Contactnumber' });
      }

    });
  });

  router.post('/checkemail', function(req, res){
    User.findOne({ email: req.body.email}).select('email').exec(function(err,user) {
      if (err) throw err;

      if(user) {
        res.json({ success: false, message: 'That email is already taken' });
      } else{
        res.json({ success: true, message: 'Valid email' });
      }

    });
  });

  //user login router
//http://localhost:3027/api/authenticate
  router.post('/authenticate', function(req, res){
    User.findOne({ username: req.body.username}).select('email fullname username password active').exec(function(err,user) {
      if (err) throw err;

      if(!user){
        res.json({ success: false, message: 'Could not authenticate user'});
      }else if (user) {
        if(req.body.password) {
          var validPassword = user.comparePassword(req.body.password);
          if (!validPassword) {
            res.json({ success: false, message: 'Could not authenticate password' });
          } else if(!user.active){
            res.json({ success:false, message:'account has not yet been activated. Please check your email for activation link', expired: true });
          } else{
            var token = jwt.sign({fullname:user.fullname, username: user.username, email: user.email }, secret, { expiresIn: '24h' } );
            res.json({ success: true, message: 'User authenticated', token: token});
          }
        } else{
          res.json({success:false, message: 'no password provided'});
        }

      }
    });
  });

  router.post('/resend', function(req, res){
    User.findOne({ username: req.body.username}).select('username password active').exec(function(err,user) {
      if (err) throw err;

      if(!user){
        res.json({ success: false, message: 'Could not authenticate user'});
      }else if (user) {
        if(req.body.password) {
          var validPassword = user.comparePassword(req.body.password);
          if (!validPassword) {
            res.json({ success: false, message: 'Could not authenticate password' });
          } else if(user.active){
            res.json({ success:false, message:'Account is already activated' });
          } else{
            res.json({success:true,  user: user});
          }
        } else{
          res.json({success:false, message: 'no password provided'});
        }

      }
    });
  });

  router.put('/resend', function(req, res){
    User.findOne({ username: req.body.username }, function(err, user){
      if(err) throw err;
      user.temporarytoken = jwt.sign({fullname:user.fullname, username: user.username, email: user.email}, secret, {expiresIn: '24h'});
      user.save(function(err){
        if(err){
          console.log(err);
        }else{
          var email = {
            from: 'The Big Whammy Team, info@thebigwhammy.com',
            to: user.email,
            subject: 'Big Whammy account activation link Request',
            text: 'Hello' + user.fullname + 'You recently requested a new account activation link. Please click on the following to cpmplete the activation: http://www.thebigwhammy.com/activate/'+user.temporarytoken,
            html: 'Hello <strong>' + user.fullname + '</strong>,<br><br>Username: <strong>'+ user.username +'</strong><br><br>You recently requested a new account activation link. Please click the link below to complete the activation:<br><a href="http://www.thebigwhammy.com/activate/'+user.temporarytoken+'">http://www.thebigwhammy.com/activate/</a>'
          };

          client.sendMail(email, function(err, info){
              if (err){
                console.log(err);
              }
              else {
                console.log('Message sent: ' + info.response);
              }
          });
          res.json({ success: true, message:'Activation link has been sent to '+user.email+'!'});
        }
      })
    })
  });

  router.put('/activate/:token', function(req, res){
    User.findOne({ temporarytoken: req.params.token },function(err, user){
      if(err) throw err;
      var token = req.params.token;

      jwt.verify(token, secret, function(err, decoded){
        if(err){
          res.json({success:false, message: 'Activation link has expired'});
        }else if(!user){
          res.json({success:false, message: 'Activation link has expired'});
        }else {
          user.temporarytoken = false;
          user.active = true;
          user.save(function(err){
            if(err){
              console.log(err);
            }else{
              var email = {
                from: 'The Big Whammy Team, info@thebigwhammy.com',
                to: user.email,
                subject: 'Account activated',
                text: 'Hello' + user.fullname + 'Your account has been successfully activated',
                html: 'Hello <strong>' + user.fullname + '</strong>,<br><br>Username: <strong>'+ user.username +'</strong><br><br>Your account has been successfully activated.'
              };

              client.sendMail(email, function(err, info){
                  if (err){
                    console.log(err);
                  }
                  else {
                    console.log('Message sent: ' + info.response);
                  }
              });

                res.json({success:true, message: 'Account has been activated'});
            }
          });
        }
      });


    });
  });
  router.use(function(req, res, next){

    var token = req.body.token || req.body.query || req.headers['x-access-token'];
    if(token){
      //verify tokenn
      jwt.verify(token, secret, function(err, decoded){
        if(err){
          res.json({success:false, message: 'Token invalid'});
        }else{
          req.decoded = decoded;
          next();
        }
      });
    }else {
      res.json({ success: false, message: 'No token provided'});
    }

  });


 router.post('/me', function(req, res) {
   res.send(req.decoded);
 });

 router.post('/entrygranted', function(req, res){
   User.findOne({ username: req.decoded.username }).select('haspaid').exec(function(err,user){
     if(err) throw err;

     if(!user){
       res.json({ success:false, message: 'Could not validate token.' });
     }else if(user) {
       if(user.haspaid){
         res.json({ success: true, message: 'User has paid.' });
       }else{
         res.json({ success:false, message: 'User is yet to pay.' });
       }
     }
   })
 });

 router.post('/rzpay', function(req, res){
   User.findOne({ username: req.decoded.username }).select('contactnum email hastopay fullname').exec(function(err,user){
     if(err) throw err;

     if(!user){
       res.json({ success:false, message: 'Could not validate token. Please logout and login again. Expired Token.' });
     }else if(user) {
       res.json({ success:true, userdetails: {fullname: user.fullname, contactnum: user.contactnum, email: user.email, hastopay: user.hastopay }});
     }
   })
 });

 router.post('/rzupdate', function(req, res){
   //TODO: Verify payment on RazorPay before updating it in db
   User.updateOne({ username:req.decoded.username }, {$set: { haspaid:true, razorpaypaymentid:req.body.instaMojoId}},(function(err, user){
     if(err){ throw err;}

     if(user.nModified > 0){
       res.json({success: true, message: 'Updated the payment records for user '+req.decoded.username});
     }else{
       res.json({success: false, message: 'Could not update record for user '+req.decoded.username});
     }

   }));
 });

 //http://localhost:3027/api/authenticate
   router.post('/authenticate', function(req, res){
     User.findOne({ username: req.body.username}).select('email fullname username password active').exec(function(err,user) {
       if (err) throw err;

       if(!user){
         res.json({ success: false, message: 'Could not authenticate user'});
       }else if (user) {
         if(req.body.password) {
           var validPassword = user.comparePassword(req.body.password);
           if (!validPassword) {
             res.json({ success: false, message: 'Could not authenticate password' });
           } else if(!user.active){
             res.json({ success:false, message:'account has not yet been activated. Please check your email for activation link', expired: true });
           } else{
             var token = jwt.sign({fullname:user.fullname, username: user.username, email: user.email }, secret, { expiresIn: '24h' } );
             res.json({ success: true, message: 'User authenticated', token: token});
           }
         } else{
           res.json({success:false, message: 'no password provided'});
         }

       }
     });
   });

  return router;
}
