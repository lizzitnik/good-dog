const bcrypt = require("bcryptjs")
const mongoose = require("mongoose")
mongoose.Promise = global.Promise

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    default: ""
  },
  lastName: {
    type: String,
    default: ""
  },
  dogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dog"
  }]
})

const DogSchema = mongoose.Schema({
  dogImage: {
    type: String
  },
  dogName: {
    type: String
  },
  dogBreed: {
    type: String
  },
  symptom: {
    type: String
  },
  additionalInfo: {
    type: String
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comments"
  }]
})

const CommentSchema = mongoose.Schema({
  commenterName: {
    type: String
  },
  commentContent: {
    type: String
  }
})

UserSchema.methods.serialize = function() {
  return {
    id: this._id,
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName,
    dogs: this.dogs
  }
}

DogSchema.methods.serialize = function() {
  return {
    id: this._id,
    dogImage: this.dogImage,
    dogName: this.dogName,
    dogBreed: this.dogBreed,
    symptom: this.symptom,
    additionalInfo: this.additionalInfo,
    comments: this.comments.map(c => c.serialize())
  }
}

CommentSchema.methods.serialize = function() {
  return {
    id: this._id,
    commenterName: this.commenterName,
    commentContent: this.commentContent
  }
}

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password)
}

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 8)
}

const User = mongoose.model("User", UserSchema)
const Dog = mongoose.model("Dog", DogSchema)
const Comments = mongoose.model("Comments", CommentSchema)

module.exports = {
  User,
  Dog,
  Comments
}