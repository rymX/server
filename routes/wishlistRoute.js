const express = require('express');
const Wishlist = require('../models/wishlistModel');
const checkAuth = require('../authMiddleware/check-auth');

const wishlistRoute = express.Router();

// get all wishlists
wishlistRoute.get('/all', (req, res) => {
    Wishlist.find()
        // .select(" _id Wishlistname owner")
        .then(rows => {
            return res.status(200).json({ rows })
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({ error: error })
        })
})
// get all 
wishlistRoute.get('/user/:userid', (req, res) => {
    Wishlist.find({ owner: req.params.userid })
        .exec().then(result => {
            return res.status(200).json(result)
        }).catch(error => {
            return res.status(500).json(error)
        })
})
// post a Wishlist 
wishlistRoute.post('/', (req, res) => {
    // have to check the owner too
    Wishlist.find({ wishlistname: req.body.wishlistname })
        .exec()
        .then(rows => {
            if (rows.length >= 1) {
                return res.status(409).json({ message: "name unvailble" });
            }
            else {
                const wishlist = new Wishlist({
                    wishlistname: req.body.wishlistname,
                    owner: req.body.owner
                });
                wishlist.save()
                    .then(result => {
                        return res.status(200).json(result);
                    })
                    .catch(error => {
                        return res.status(500).json({ error: error })
                    })
            }
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({ message: error });
        })
})

// delete Wishlist
wishlistRoute.delete('/', checkAuth, (req, res) => {
    Wishlist.deleteOne({ wishlistname: req.body.wishlistname })
        .exec()
        .then(result => {
            return res.status(200).json(result)
        })
        .catch(error => {
            return res.status(500).json(error)
        })
})
module.exports = wishlistRoute;