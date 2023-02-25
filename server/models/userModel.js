const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    select: false,
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
  passwordChangedAt: Date,
});

// this will run after the data is received from the client and before it is saved in DB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // Hash the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete the passwordConfirm field.
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  reqBodyPassword,
  userPassword
) {
  // this.password in this case won't work since we have set select to false in schema
  return await bcrypt.compare(reqBodyPassword, userPassword);
};

userSchema.methods.passwordChangedAfter = async function (JWTtimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return changedTimeStamp > JWTtimeStamp;
  }

  return false;
};

User = model('User', userSchema);

module.exports = User;
