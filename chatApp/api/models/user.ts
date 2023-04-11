import { Schema } from 'mongoose';
const mongoose = require('mongoose');
const UserSchema = new Schema(
  {
    username: { type: String, unique: true },
    password: String
  },
  { timestamps: true }
);
const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
