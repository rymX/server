const mongoose = require('mongoose');
const User = require('./userModel');
const Wishlist = require('./wishlistModel')

const productSchema = mongoose.Schema({
    productname : String ,
    productprice : Number ,
    currency : String ,
    description : String ,
    wishlistid: {
        type :  mongoose.Schema.Types.ObjectId ,
       ref : "Wishlist"
    } , 
    status : String , 
    imageurl : String ,
    owner:{
        type :  mongoose.Schema.Types.ObjectId ,
       ref : "User"
    }
});

module.exports = mongoose.model('Product', productSchema)