const express = require("express")
const router = express.Router()
const passport = require("passport")

const bodyParser = require("body-parser")
const jsonParser = bodyParser.json()

const mongoose = require("mongoose")
mongoose.Promise = global.Promise

const {
  Dog,
  User
} = require('../models')

const jwtAuth = passport.authenticate('jwt', {
  session: false
})

router.get('/', (req, res) => {
  Dog.find()
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

router.get('/my', (req, res) => {
  User.findById(req.user.id)
    .populate('dogs')
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

router.get('/:id', (req, res) => {
  Dog.findById(req.params.id)
    .then(post => res.json(post.serialize()))
    .catch(err => {
      console.error(err)
      res.status(500).json({
        error: "something went horribly awry"
      })
    })
})

router.post('/', (req, res) => {
  const requiredFields = ['dogName', 'dogBreed', 'symptom']
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i]
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message)
      return res.status(400).send(message)
    }
  }
  console.log('rendering req.body' + req.body)
  Dog.create({
      dogName: req.body.dogName,
      dogBreed: req.body.dogBreed,
      symptom: req.body.symptom,
      additionalInfo: req.body.additionalInfo
    })
    .then(dog => {
      console.log(dog)
      res.status(201).json(dog.serialize())
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })

})

router.put('/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    })
  }
  const updated = {}
  const updatableFields = ['symptom', 'additionalInfo']
  updatableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field]
    }
  })
  Dog.findByIdAndUpdate(req.params.id, {
      $set: updated
    }, {
      new: true
    })
    .then(updatedPost => res.status(204).end())
    .catch(err => res.status(500).json({
      message: 'Something went wrong'
    }))
})

router.delete('/:id', (req, res) => {
  Dog.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({
        message: 'success'
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: 'something went terribly wrong'
      })
    })
})

module.exports = router