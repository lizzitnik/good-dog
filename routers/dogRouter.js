const express = require("express")
const router = express.Router()
const passport = require("passport")

const bodyParser = require("body-parser")
const jsonParser = bodyParser.json()
const axios = require("axios")

const mongoose = require("mongoose")
mongoose.Promise = global.Promise

const { Dog, User, Comments } = require("../models")

const jwtAuth = passport.authenticate("jwt", {
  session: false
})

router.get("/", (req, res) => {
  Dog.find()
    .populate("comments")
    .then(dogs => {
      res.json({
        dogs: dogs.map(dog => dog.serialize())
      })
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({
        message: err
      })
    })
})

router.get("/my", jwtAuth, (req, res) => {
  User.findById(req.user.id)
    .populate("dogs")
    .then(user => {
      res.json({
        dogs: user.dogs.map(dog => dog.serialize())
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: err
      })
    })
})

router.get("/comments", jwtAuth, (req, res) => {
  Dog.findById(req.dog.id)
    .populate("comments")
    .then(dog => {
      res.json({
        comments: dog.comments.map(comment => comment.serialize())
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: err
      })
    })
})

router.get("/:id", (req, res) => {
  Dog.findById(req.params.id)
    .then(post => res.json(post.serialize()))
    .catch(err => {
      console.error(err)
      res.status(500).json({
        error: "something went horribly awry"
      })
    })
})

router.post("/", jwtAuth, (req, res) => {
  const requiredFields = ["dogName", "dogBreed", "symptom"]
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i]
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message)
      return res.status(400).send(message)
    }
  }
  console.log("rendering req.body" + req.body)
  const url = `https://dog.ceo/api/breed/${req.body.dogBreed}/images/random`
  debugger
  axios
    .get(url)
    .then(response => {
      Dog.create({
        dogImage: response.data.message,
        dogName: req.body.dogName,
        dogBreed: req.body.dogBreed,
        symptom: req.body.symptom,
        additionalInfo: req.body.additionalInfo,
        comments: req.body.comments
      })
        .then(dog => {
          console.log(dog)
          User.findByIdAndUpdate(
            req.user.id,
            {
              $push: {
                dogs: dog._id
              }
            },
            function(err, model) {
              console.log(err)
            }
          )
          res.status(201).json(dog.serialize())
        })
        .catch(err => {
          console.error(err)
          res.status(500).json({
            error: err
          })
        })
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({
        error: err
      })
    })
})

router.post("/comments", (req, res) => {
  const requiredFields = ["commenterName", "commentContent"]
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i]
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message)
      return res.status(400).send(message)
    }
  }
  console.log("rendering req.body" + req.body)
  Comments.create({
    commenterName: req.body.commenterName,
    commentContent: req.body.commentContent
  })
    .then(comment => {
      console.log(comment)
      Dog.findByIdAndUpdate(
        req.body.id,
        {
          $push: {
            comments: comment._id
          }
        },
        function(err, model) {
          console.log(err)
        }
      )
      res.status(201).json(comment.serialize())
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
})

router.put("/:id", (req, res) => {
  const updated = {}
  const updatableFields = ["symptom", "additionalInfo"]
  updatableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field]
    }
  })
  Dog.findByIdAndUpdate(
    req.params.id,
    {
      $set: updated
    },
    {
      new: true
    }
  )
    .populate("comments")
    .then(updatedPost => {
      res.status(201).json(updatedPost.serialize())
    })
    .catch(err => {
      res.status(500).json({
        message: err
      })
    })
})

router.delete("/:id", (req, res) => {
  Dog.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({
        message: "success"
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: "something went terribly wrong"
      })
    })
})

module.exports = router
