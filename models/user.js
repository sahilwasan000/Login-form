const mongoose = require('mongoose');
const validator = require('validator');

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
    unique: true
  },
    password: {
      type: String,
      required: true,
      minlength: 6
  },
  date: {
    type: Date,
    default: Date.now
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};
