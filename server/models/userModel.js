const crypto = require('crypto');
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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
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
  passwordResetToken: String,
  passwordResetExpiresOn: Date,
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

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  const oneSecond = 1000;

  // make the password change time 1 second before
  // so that it won't be before JWT signed time.
  this.passwordChangedAt = Date.now() - oneSecond;

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

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const timeInMs = 10 * 60 * 1000;

  this.passwordResetExpiresOn = Date.now() + timeInMs;

  return resetToken;
};

User = model('User', userSchema);

module.exports = User;
