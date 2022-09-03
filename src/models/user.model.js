const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxLength: 50,
      minLength: 5
    },
    accountNumber: {
      type: Number,
      required: true,
      unique: true
    },
    emailAddress: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxLength: 100,
      minLength: 5
    },
    identityNumber: {
      type: Number,
      required: true,
      unique: true
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
