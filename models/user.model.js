const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    minlength:[ 3 , 'email must be at least 3 characters']
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    minlength:[ 3 , 'email must be at least 3 characters']
  }
  ,
  password: {
    type: String,
    required: true,
    trim:true,
    minlength:[ 3 , 'password must be at least 3 characters']

  }


})

const user = mongoose.model('user', userSchema)

module.exports = user