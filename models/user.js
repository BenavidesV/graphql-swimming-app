const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  role: {
    type: String,
    required: true,
    maxlength: 1
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  identification: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  fullname: {
    type: String,
    required: true
  },
  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Event'
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
