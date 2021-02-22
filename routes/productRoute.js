const express = require('express');
const Product = require('../models/productModel');
const checkAuth = require('../authMiddleware/check-auth');
// const Wishlist = require('../models/wishlistModel');
const multer = require('multer');

const productRoute = express.Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    }
    else {
        cb(null, false)
    }
}
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: fileFilter
});

// get all products
// productRoute.get('/all', (req, res) => {
//     Product.find()
//         // .select(" _id productname owner")
//         .then(rows => {
//             return res.status(200).json({ rows })
//         })
//         .catch(error => {
//             console.log(error);
//             return res.status(500).json({ error: error })
//         })
// })

// get all product of specific wishlist 
//add protection by checkAuth middleware
productRoute.get('/wishlist/:wishlistid', (req, res) => {
    Product.find({ wishlistid: req.params.wishlistid })
        .exec().then(result => {
            return res.status(200).json(result)
        }).catch(error => {
            return res.status(500).json(error)
        })
})
// get all product of spesific user 
//add protection by checkAuth middleware
productRoute.get('/userid/:userid', (req, res) => {
    Product.find({ owner: req.params.userid })
        .exec().then(result => {
            return res.status(200).json(result)
        }).catch(error => {
            return res.status(500).json(error)
        })
});
// post a product 
//add protection by checkAuth middleware
productRoute.post('/', upload.single('productimg'), (req, res) => {
    // console.log(req.file);
    // console.length(req.body);
    const product = new Product({
        productname: req.body.productname,
        productprice: req.body.productprice,
        currency: req.body.currency,
        description: req.body.description,
        wishlistname: req.body.wishlistname,
        wishlistid: req.body.wishlistid,
        status: req.body.status,
        imageurl: "http://localhost:4000/" + req.file.path,
        owner: req.body.owner
    });
    product.save()
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            return res.status(500).json({ error: error })
        })
})

//edit product 
// checked later by checkAuth
productRoute.patch('/', (req, res) => {
    Product.updateOne({ productname: productname },
        {
            $set: {
                productname: req.body.productname,
                productprice: req.body.productprice,
                currency: req.body.currency,
                description: req.body.description,
                status: req.body.status,
                imageurl: "http://localhost:4000/" + req.file.path,
                description: req.body.description,
            wishlistname: req.body.wishlistname,
            wishlistid: req.body.wishlistid,
            }
        })
        .exec()
        .then(result => {
            return res.status(200).json(result)
        })
        .catch(error => {
            return res.status(500).json(error)
        })
})
// delete product
//add protection by checkAuth middleware
productRoute.delete('/id/:id', (req, res) => {
    Product.remove({ _id: req.params.id })
        .exec()
        .then(result => {
        })
        .catch(error => {
            return res.status(500).json(error)
        })
})
module.exports = productRoute;