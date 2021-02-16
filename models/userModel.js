const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username : String ,
    useremail : String , 
    password : String
});

module.exports = mongoose.model('User', userSchema)