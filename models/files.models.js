const mongoose = require('mongoose');
const user = require('./user.model');

const fileSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true
  },
  originalname: {
    type: String,
    required: true
  } ,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  }
})
  
const file = mongoose.model('file', fileSchema);

module.exports = file;