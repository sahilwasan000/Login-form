const validator = require('validator');
const isEmpty = require('is-empty');

var validateRegisteredUser = (data) => {
  let errors = {};

  //for name
  if(validator.isEmpty(data.name)){
    errors.name = 'Name is required';
  }

  //for email
  if(validator.isEmpty(data.email)){
    errors.email = 'Email is required';
  } else if(!validator.isEmail(data.email)){
    errors.email = 'Please enter valid email';
  }

  //for password
  if(validator.isEmpty(data.password)){
    errors.password = 'Password is required';
  } else if(!validator.isLength(data.password, {min:6, max: 30})){
    errors.password = 'Password must be at least 6 char and not more than 30 char';
  }

  //for confirm password
  if(validator.isEmpty(data.password2)){
    errors.password2 = 'Please Confirm Password';
  } else if(!validator.equals(data.password, data.password2)){
    errors.password2 = 'Passwords should match';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = {validateRegisteredUser};
