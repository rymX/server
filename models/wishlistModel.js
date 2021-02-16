const mongoose = require('mongoose');
const User = require('./userModel');
const Product = require('./productModel')

const wishlistSchema = mongoose.Schema({
    wishlistname : String ,
    products : [
        {
            type :  mongoose.Schema.Types.ObjectId ,
           ref : "Product"
        }
    ], 
    owner:{
        type :  mongoose.Schema.Types.ObjectId ,
       ref : "User"
    }
});

module.exports = mongoose.model('Wishlist', wishlistSchema)