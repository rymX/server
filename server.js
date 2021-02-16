const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const userRoute = require('./routes/userRoute');
const productRoute = require('./routes/productRoute');
const wishlistRoute = require('./routes/wishlistRoute');
require('dotenv').config();


const server = express();
// env var 
// mongodb+srv://root:123wishlistdb456@cluster0.m1mao.mongodb.net/test
//mongodb+srv://root:process.env.DB_PASSWORD@cluster0.m1mao.mongodb.net/wishlistdb?retryWrites=true&w=majority
mongoose.connect('mongodb+srv://root:123wishlistdb456@cluster0.m1mao.mongodb.net/test', {  
useUnifiedTopology: true,
    useNewUrlParser: true

}, () => {
    console.log('connection to database established')
})
// server.use(bodyParser.urlencoded({extended : false}))
server.use(bodyParser.json());

// server.use('/uploads',express.static('upload'));


// userRoute
server.use('/user', userRoute);
// productRoute
server.use('/product', productRoute)
// wishlistRoute
server.use('/wishlist' , wishlistRoute );

server.listen(4000);