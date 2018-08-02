var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');

var nameValidator = [
  validate({
    validator: 'matches',
    arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
    message: 'Name must contain no special characters or numbers, must have space between first and the last name'
  }),
  validate({
    validator: 'isLength',
    arguments: [3, 20],
    message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
  })
];

var emailValidator = [
  validate({
    validator: 'isEmail',
    message: 'Not a valid email'
  }),


    validate({
      validator: 'isLength',
      arguments: [3, 250],
      message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

var usernameValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 25],
    message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
  }),

  validate({
    validator: 'isAlphanumeric',
    message: 'Username should contain alpha-numeric characters only',
  }),
];

var passwordValidator = [
  validate({
    validator: 'matches',
    arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/,
    message: 'Password needs to have at least one lower case, one upper case, one number, one special character and must be at least 8 character but no more than 35.' ,
  }),

  validate({
    validator: 'isLength',
    arguments: [8, 35],
    message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
  })
];

var userSchema = new Schema({
  fullname: {type:String, required: true, validate: nameValidator},
  username: {type: String, lowercase: true, required: true, unique: true, validate: usernameValidator},
  password: {type: String, required: true, validate: passwordValidator, select: false},
  email: {type: String, required: true, lowercase: true, unique:true, validate: emailValidator},
  favclub: {type: String, required: true, lowercase: true},
  teamname: {type:String, required: true, lowercase: true},
  contactnum: {type:Number, required:true, unique:true},
  whatsappnum: {type:Number, required:true, unique:true},
  refferedby: {type:String, lowercase: true},
  country: {type:String, lowercase: true},
  dob: {type:Number},
  active: {type:Boolean, required:true, default: false},
  temporarytoken: {type:String, required: true}

});

userSchema.pre('save', function(next){
  var user = this;

  if(!user.isModified('password')) return next();

  bcrypt.hash(user.password, null, null, function(err, hash){
    if(err) return next(err);
    user.password = hash;
    next();
  });
});


//all names are consistent and titilized
userSchema.plugin(titlize, {
  paths: [ 'fullname' ], // Array of paths
});


 userSchema.methods.comparePassword = function(password) {
   return bcrypt.compareSync(password, this.password);
 };

module.exports = mongoose.model('User', userSchema);
