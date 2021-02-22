const express = require("express");
const Wishlist = require("../models/wishlistModel");
const checkAuth = require("../authMiddleware/check-auth");

const wishlistRoute = express.Router();

// get all wishlists of a specific user
//add protection by checkAuth middleware
wishlistRoute.get("/user/:userid", (req, res) => {
  Wishlist.find({ owner: req.params.userid })
    .select("wishlistname")
    .exec()
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((error) => {
      return res.status(500).json(error);
    });
});
// post a Wishlist
//add protection by checkAuth middleware
wishlistRoute.post("/", (req, res) => {
  Wishlist.find({ wishlistname: req.body.wishlistname, owner: req.body.owner })
    .exec()
    .then((rows) => {
      if (rows.length >= 1) {
        return res.status(409).json({ message: "wishlistname unvailble" });
      } else {
        const wishlist = new Wishlist({
          wishlistname: req.body.wishlistname,
          owner: req.body.owner,
        });
        wishlist
          .save()
          .then((result) => {
            return res.status(200).json(result);
          })
          .catch((error) => {
            return res.status(500).json({ error: error });
          });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ message: error });
    });
});

// delete Wishlist
//add protection by checkAuth middleware
wishlistRoute.delete("/id/:id", (req, res) => {
  Wishlist.deleteOne({ _id: req.params.id })
    .exec()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      return res.status(500).json(error);
    });
});

// Edit wishlist
//add protection by checkAuth middleware
wishlistRoute.patch("/", (req, res) => {
  Wishlist.findByIdAndUpdate(req.body.id, {
    wishlistname: req.body.wishlistname,
  })
    .exec()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      return res.status(500).json(error);
    });
});

module.exports = wishlistRoute;
