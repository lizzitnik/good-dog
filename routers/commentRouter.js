const express = require("express")
const router = express.Router()
const passport = require("passport")

const bodyParser = require("body-parser")
const jsonParser = bodyParser.json()

const mongoose = require("mongoose")
mongoose.Promise = global.Promise

const {
  Comments,
  User
} = require('../models')

const jwtAuth = passport.authenticate('jwt', {
  session: false
})

router.get('/', (req, res) => {
  Comments.find()
    .then(comments => {
      res.json({
        comments: comments.map(comment => comment.serialize())
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
    .populate('comments')
    .then(user => {
      res.json({
        comments: user.comments.map(comment => comment.serialize())
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
  Comments.findById(req.params.id)
    .then(post => res.json(post.serialize()))
    .catch(err => {
      console.error(err)
      res.status(500).json({
        error: "something went horribly awry"
      })
    })
})

router.post('/', (req, res) => {
  const requiredFields = ['commenterName', 'commentContent']
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i]
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message)
      return res.status(400).send(message)
    }
  }
  console.log('rendering req.body' + req.body)
  Comments.create({
      commenterName: req.body.commenterName,
      commentContent: req.body.commentContent,
    })
    .then(comment => {
      console.log(comment)
      res.status(201).json(comment.serialize())
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })

})

router.delete('/:id', (req, res) => {
  Comments.findByIdAndRemove(req.params.id)
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