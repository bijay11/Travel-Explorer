const mongoose = require('mongoose');
const validator = require('validator');

const { Schema, model } = mongoose;
const { isEmail } = validator;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name  is required.'],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    validate: [isEmail, 'Please provide a valid email.'],
    required: [true, 'Email is required.'],
  },
  photo: String,
  password: {
    type: String,
    minLength: 8,
    required: [true, 'Please provide a password'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords doesn't match",
    },
  },
});

User = model('User', userSchema);

module.exports = User;
