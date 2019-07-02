const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: {
    type: String,
    required: true
},
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    // validate: validator.isEmail
  },
    password: {
      type: String,
      required: true,
      minlength: 6
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};
