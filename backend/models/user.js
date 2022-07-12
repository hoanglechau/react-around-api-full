const mongoose = require('mongoose');
const { urlRegExp } = require('../utils/regex');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The "name" field must be filled in'],
    minlength: [2, 'The minimum length of the "name" field is 2'],
    maxlength: [30, 'The maximum length of the "name" field is 30'],
  },
  about: {
    type: String,
    required: [true, 'The "about" field must be filled in'],
    minlength: [2, 'The minimum length of the "about" field is 2'],
    maxlength: [30, 'The maximum length of the "about" field is 30'],
  },
  avatar: {
    type: String,
    required: [true, 'The "avatar" field must be filled in'],
    validate: {
      validator: (v) => urlRegExp.test(v),
      message: 'The "avatar" field must be a valid URL',
    },
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
