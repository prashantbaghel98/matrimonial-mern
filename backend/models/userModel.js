const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    username:{
        type:String,
        unique:true
    },
    email:{
        type:String,
        unique:true
    },
    mobile:{
        type:Number,
    },
    password:{
        type:String,
    }
})

const userModel = mongoose.models.User || mongoose.model('User',userSchema);

module.exports = userModel;