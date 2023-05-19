const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  f_name: {
    type: String,
    required: true,
  },
  l_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    require: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
    require: true,
  },
});

module.exports = mongoose.model("users", UserSchema);
