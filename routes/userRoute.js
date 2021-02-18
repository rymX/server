const express = require('express');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userRoute = express.Router();

// get all the users 
userRoute.get('/all', (req, res) => {
User.find() 
.exec()
.then( rows =>{
    return res.status(200).json({rows})
})
.catch(error =>{
    console.log(error);
    return res.status(500).json({error : error})
})
});

// get a specific user 

userRoute.get('/login/username/:username/password/:password', (req, res) => {
    console.log(req.params)
    User.find({username : req.params.username})
    .select("_id username password")
    .then(rows =>{
        if (rows.length < 1){
            return res.status(401).json({message : "wrong username "})
        }
        bcrypt.compare(req.params.password , rows[0].password , (err, response)=>{
                if (response){
                 const token =   jwt.sign({
                        username : rows[0].username,
                        id : rows[0]._id
                    } , 
                    process.env.JWT_KEY,
                    );
                    //res.setHeader('Set-Cookie', {'jwt':token})
                    res.cookie('jwt' , token);
                    res.status(200).json({ user : rows[0]._id });
                    
                }
                else {
                    return res.status(401).json({messgae : "wrong password"});
                }
            } );
    })
    .catch(error =>{
        console.log(error);
        return res.status(500).json({message : error});
        
    })

});
// post a user 
userRoute.post('/signup', (req, res) => {
    User.find({ username: req.body.username })
        .exec()
        .then(rows =>{
            if( rows.length>=1)
            {
                return res.status(409).json({message : "username  already exists"})
            }
            else {
                bcrypt.hash(req.body.password , 10 , (err , hash)=>{
                    if (err){
                        console.log(error)
                        return res.status(500).json({error : err})
                    }
                    else {
                        const user = new User({
                            username : req.body.username,
                            useremail : req.body.useremail , 
                            password : hash
                        });
                        user.save()
                        .then(result =>{
                            return res.status(200).json(result);
                        })
                        .catch(error =>{
                            console.log(error)
                            res.status(500).json({error : error});
                        })
                    }
                })
            }
        })
        .catch(error =>{
            console.log(error)
            return res.status(500).json({messageerror : error});
        })
});
userRoute.get('/logout', (req,res)=>{
    res.cookie('jwt', '', {maxAge : 1});
    res.json('good by');
})
module.exports= userRoute ;