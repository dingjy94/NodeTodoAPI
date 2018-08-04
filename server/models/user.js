const mongoose = require('mongoose');

const User = mongoose.model('User', {
  email: {
    type: String,
    trim: true,
    required: true,
    minlength: 1
  },
  name: {
    type: String,
    required: true,
    trim: true
  }
});

module.exports = {User};