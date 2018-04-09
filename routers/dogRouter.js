const express = require("express")
const router = express.Router()
const passport = require("passport")

const bodyParser = require("body-parser")
const jsonParser = bodyParser.json()

const mongoose = require("mongoose")
mongoose.Promise = global.Promise

const {
  Dog
} = require('../models')

router.get('/', (req, res) => {
  Dog.find()
    .then(dogs => {
      res.json({
        dogs: dogs.map(dog = > dog.serialize())
      })
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({
        message: err
      })
    })
})

router.get('/:id', (req, res) => {
  Dog.findById(req.parama.id)
    .then(post => res.json(post.serialize()))
    .catch(err => {
      console.error(err)
      res.status(500).json({
        error: "something went horribly awry"
      })
    })
})