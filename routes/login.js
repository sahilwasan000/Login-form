const validator = require('validator');
const isEmpty = require('is-empty');

var validateLoginUser = (data) =>  {
  let errors = {};
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
  return {
    errors,
    isValid: isEmpty(errors)
    };
};

module.exports = {validateLoginUser};
