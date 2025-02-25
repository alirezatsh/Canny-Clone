const { Type } = require('@aws-sdk/client-s3')
const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    username : {
        Type : String,
        required : true,
        unique : true,
        trim: true
    },
  

    
})


module.exports = mongoose.model('User' , UserSchema)