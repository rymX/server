const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const userRoute = require('./routes/userRoute');
const productRoute = require('./routes/productRoute');
const wishlistRoute = require('./routes/wishlistRoute');
const cors = require('cors');
require('dotenv').config();


const server = express();

// env var 
// mongodb+srv://root:123wishlistdb456@cluster0.m1mao.mongodb.net/test

//mongodb+srv://root:process.env.DB_PASSWORD@cluster0.m1mao.mongodb.net/wishlistdb?retryWrites=true&w=majority
mongoose.connect('mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false', {  
useUnifiedTopology: true,
    useNewUrlParser: true

}, () => {
    console.log('connection to database established')
})
server.use(cors());

server.use(bodyParser.urlencoded({extended : false}))
server.use(bodyParser.json());

server.use('/uploads',express.static('uploads'));

server.use(cookieParser());
// userRoute
server.use('/user', userRoute);
// productRoute
server.use('/product', productRoute)
// wishlistRoute
server.use('/wishlist' , wishlistRoute );
server.get('/read-cookies',(req,res)=>{
   const cookies = req.cookies ;
   console.log(cookies);
})

server.listen(4000);