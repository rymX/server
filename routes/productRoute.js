const express = require('express');
const Product = require('../models/productModel');
const checkAuth = require('../authMiddleware/check-auth');
const Wishlist = require('../models/wishlistModel');
const multer = require('multer');

const productRoute = express.Router();


const storage = multer.diskStorage({
   destination : function(req, file , cb){
      cb(null , './uploads/');
   },
   filename : function(req,file,cb){
      cb(null , file.originalname);
   }
})
const fileFilter = (req, file , cb)=>{
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' ){
        cb(null , true)
    }
    else {
        cb(null , false)
    }
   
    
}
const upload = multer({
    storage : storage,
    limits :{ fileSize: 1024 *1024 *5},
     fileFilter : fileFilter
});

// get all products
productRoute.get('/all', (req, res) => {
    Product.find()
        // .select(" _id productname owner")
        .then(rows => {
            return res.status(200).json({ rows })
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({ error: error })
        })
})
// get all product of spesific user 
// and specific wishlist 
productRoute.get('/user/:userid/wishlist/:wishlistid', (req, res) => {
    Product.find({ owner: req.params.userid })
        .exec().then(result => {
            return res.status(200).json(result)
        }).catch(error => {
            return res.status(500).json(error)
        })
})
// post a product 
productRoute.post('/', upload.single('productimg') , (req, res) => {
    console.log(req.file);
    Product.find({ productname: req.body.productname })
        .exec()
        .then(rows => {
            if (rows.length >= 1) {
                return res.status(409).json({ message: "you already wish this product" });
            }
            else {
                const product = new Product({
                    productname: req.body.productname,
                    productprice: req.body.productprice,
                    currency: req.body.currency,
                    description: req.body.description,
                    wishlistid : req.bodywishlistid,
                    status: req.body.status,
                    imageurl: req.file.path,
                    owner: req.body.owner
                });
                // have to update wishlist's products array
                product.save()
                    .then(result => {
                      //  Wishlist.findByIdAndUpdate({owner : req.body.owner },{$push { products : req.body.productname}} )
                        return res.status(200).json(result);
                    })
                    .catch(error => {
                        return res.status(500).json({ error: error })
                    })
            }
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({ error: error });
        })
})
//edit product 
productRoute.patch('/', checkAuth, (req, res) => {
   // const owner = req.params.owner
   // const productname = req.params.productname ;
    Product.updateOne({ productname: productname },
        {
            $set: {
                productname: req.body.productname,
                productprice: req.body.productprice,
                currency: req.body.currency,
                description: req.body.description,
                status: req.body.status,
                imageurl: req.body.imageurl,
            }
        })
        .exec()
        .then(result => {
            // if wishlist chages here , 
              //  Wishlist.findByIdAndUpdate({owner : req.body.owner },{$push { products : req.body.productname}} )
           
            return res.status(200).json(result)
        })
        .catch(error => {
            return res.status(500).json(error)
        })
})
// delete product
productRoute.delete('/', checkAuth, (req, res) => {
    Product.remove({ productname: req.body.productname })
        .exec()
        .then(result => {
            // have to update wishlist's products array
            //  Wishlist.findByIdAndUpdate({owner : req.body.owner },{$push { products : req.body.productname}} )
            return res.status(200).json(result)
        })
        .catch(error => {
            return res.status(500).json(error)
        })
})
module.exports = productRoute;