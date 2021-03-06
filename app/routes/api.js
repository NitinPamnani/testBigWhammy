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
  /*host: 'smtpout.asia.secureserver.net',
  port: 465,
  secure: true,
  auth: {
    user: 'info@thebigwhammy.com',
    pass: 'TheBigWhammy@123'*/


      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          user: 'thebigwhammyofficial@gmail.com',
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
            html: 'Hello <strong>' + user.fullname + '</strong>,<br><br>Username: <strong>'+ user.username +'</strong><br><br> Thank you for registering at The Big Whammy. Please click the link below to complete the activation:<br><a href="http://www.thebigwhammy.com/activate/'+user.temporarytoken+'">http://www.thebigwhammy.com/activate/</a><br><strong>Note: In case of any issue please reach out to us at info@thebigwhammy.com<br>Please do not reply to this email</strong>'
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

    router.post('/getAllEmails', function(req,res){
        console.log("Works");
        User.find().select('email fullname contactnum haspaid agreetopay2019').exec(function(err, user){
            if(err) throw err;
            if(user){
                res.json(user);
            }

        });
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
            html: 'Hello <strong>' + user.fullname + '</strong>,<br><br>Username: <strong>'+ user.username +'</strong><br><br>You recently requested a new account activation link. Please click the link below to complete the activation:<br><a href="http://www.thebigwhammy.com/activate/'+user.temporarytoken+'">http://www.thebigwhammy.com/activate/</a><br><strong>Note: In case of any issue please reach out to us at info@thebigwhammy.com<br>Please do not reply to this email</strong>'
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
                html: 'Hello <strong>' + user.fullname + '</strong>,<br><br>Username: <strong>'+ user.username +'</strong><br><br>Your account has been successfully activated.<br><strong>Note: In case of any issue please reach out to us at info@thebigwhammy.com<br>Please do not reply to this email</strong>'
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

  router.get('/fetchusername/:email', function(req, res){
    User.findOne({ email: req.params.email }).select('email fullname username').exec(function(err, user) {
      if(err) {
        res.json({ success: false, message: err});
      }else {
        if(!req.params.email) {
          res.json({ success: false, message: 'no e-mail was provided' });
        }else {
            if (!user) {
                res.json({success: false, message: 'Email was not found'});
            } else {
                var email = {
                    from: 'The Big Whammy Team, info@thebigwhammy.com',
                    to: user.email,
                    subject: 'Requesting Username',
                    text: 'Hello' + user.fullname + 'Your request to fetch username succeeded',
                    html: 'Hello <strong>' + user.fullname + '</strong>,Below is the username with which you registered<br><br>Username: <strong>' + user.username + '</strong><br><br>'
                };

                client.sendMail(email, function (err, info) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('Message sent: ' + info.response);
                    }
                });
                res.json({success: true, message: 'Username has been sent to e-mail'});
            }
        }
      }
    });
  });


  router.put('/resetpassword', function(req, res){
    User.findOne({ username: req.body.username }).select('username active email fullname resettoken').exec(function(err, user){
        if(err) throw err;
        if(!user) {
          res.json({ success: false, message: 'Username not founnd' });
        } else if (!user.active) {
          res.json({success: false, message: 'Account has not yet been activated'});
        } else {
            user.resettoken = jwt.sign({fullname:user.fullname, username: user.username, email: user.email}, secret, {expiresIn: '24h' });
            user.save(function(err) {
              if (err) {
                res.json({ success: false, message: err});
              } else {

                  var email = {
                      from: 'The Big Whammy Team, info@thebigwhammy.com',
                      to: user.email,
                      subject: 'The Big Whammy account reset password request',
                      text: 'Hello' + user.fullname + 'You recently requested a password reset for your account associated with The Big Whammy. Please click on the following to complete the process: http://www.thebigwhammy.com/reset/'+user.resettoken,
                      html: 'Hello <strong>' + user.fullname + '</strong>,<br><br>Username: <strong>'+ user.username +'</strong><br><br> You recently requested a password reset for your account associated with The Big Whammy. Please click on the following to complete the process:<br><a href="http://www.thebigwhammy.com/reset/'+user.resettoken+'">http://www.thebigwhammy.com/reset/</a><br><strong>Note: In case of any issue please reach out to us at info@thebigwhammy.com<br>Please do not reply to this email</strong>'
                  };

                  client.sendMail(email, function(err, info){
                      if (err){
                          console.log(err);
                      }
                      else {
                          console.log('Message sent: ' + info.response);
                      }
                  });
                res.json({ success: true, message: 'Please check your email for password reset link'});
              }
            });
        }
      });
  });

  router.get('/resetpassword/:token', function(req, res){
    User.findOne({ resettoken: req.params.token }).select().exec(function(err,user){
      if(err) throw err;
      var token = req.params.token;
        //verify token
        jwt.verify(token, secret, function(err, decoded){
            if(err){
                res.json({success:false, message: 'Password reset link has expired'});
            }else{
                if(!user){
                  res.json({ success:false, message:'Passsword link has expired'});
                }else {
                    res.json({success: true, user: user});
                }
            }
        });
    });
  });

  router.put('/savepassword', function(req, res) {
    User.findOne({ username: req.body.username }).select('username fullname password resettoken email').exec(function(err, user){
    if(err) throw err;
    if(req.body.password == null || req.body.password =='') {
        res.json({ success: false, message:'Password not provided'});
    } else {
        user.password = req.body.password;
        user.resettoken = false;
        user.save(function(err) {
            if(err) {
                res.json({success: false, message: err});
            }else {
                var email = {
                    from: 'The Big Whammy Team, info@thebigwhammy.com',
                    to: user.email,
                    subject: 'The Big Whammy account reset password request',
                    text: 'Hello' + user.fullname + 'This email is to notify you that your password was recently reset at The Big Whammy',
                    html: 'Hello <strong>' + user.fullname + '</strong>,<br><br>Username: <strong>'+ user.username +'</strong><br><br> This email is to notify you that your password was recently reset at The Big Whammy<br><strong>Note: In case of any issue please reach out to us at info@thebigwhammy.com<br>Please do not reply to this email</strong>'
                };

                client.sendMail(email, function(err, info){
                    if (err){
                        console.log(err);
                    }
                    else {
                        console.log('Message sent: ' + info.response);
                    }
                });
                res.json({ success: true, message: 'Password has been reset'});
            }
        });
      }
    });
  });

  //Middleware
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
   User.findOne({ username: req.decoded.username }).select('haspaid2019').exec(function(err,user){
     if(err) throw err;

     if(!user){
       res.json({ success:false, message: 'Could not validate token.' });
     }else if(user) {
       if(user.haspaid2019){
         res.json({ success: true, message: 'User has paid.' });
       }else{
         res.json({ success:false, message: 'User is yet to pay.' });
       }
     }
   })
 });

 router.post('/isdeclarationfilled', function(req, res){
        User.findOne({ username: req.decoded.username }).select('agreetopay2019').exec(function(err,user){
            if(err) throw err;

            if(!user){
                res.json({ success:false, message: 'Could not validate token.' });
            }else if(user) {
                if(user.agreetopay2019){
                    res.json({ success: true, message: 'User has agreed to pay later.' });
                }else{
                    res.json({ success:false, message: 'User denies to pay later.' });
                }
            }
        })
 });



    router.post('/hasjoined2019', function(req, res){
        User.findOne({ username: req.decoded.username }).select('hasjoined2019').exec(function(err,user){
            if(err) throw err;

            if(!user){
                res.json({ success:false, message: 'Could not validate token.' });
            }else if(user) {
                if(user.agreetopay2019){
                    res.json({ success: true, message: 'User has already joined.' });
                }else{
                    res.json({ success:false, message: 'User has not joined yet.' });
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
   User.updateOne({ username:req.decoded.username }, {$set: { haspaid2019:true, instapaymentid2019:req.body.instaMojoId}},(function(err, user){
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

   router.post('/updateDeclaration', function(req, res){
       //console.log("reaches here"+req.body.email);
       User.updateOne({ email:req.decoded.email}, {$set:{ team2019:req.body.teamname, agreetopay2019:req.body.agreeWithDeclaration, payment2019:130000, haspaid2019:false}}, (function(err, user){
        if(err) throw err;

           if(user.nModified > 0){
               res.json({success: true, message: 'Updated the declaration for '+req.body.firstname+" "+req.body.lastname});
           }else{
               res.json({success: false, message: 'Could not update declaration for '+req.body.firstname+" "+req.body.lastname});
           }
       }));
   });



  return router;
}
