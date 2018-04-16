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
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  dogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dog'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comments'
  }]
})

const DogSchema = mongoose.Schema({
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
  }
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
    lastName: this.lastName
  };
};

DogSchema.methods.serialize = function() {
  return {
    id: this._id,
    dogName: this.dogName,
    dogBreed: this.dogBreed,
    symptom: this.symptom,
    additionalInfo: this.additionalInfo
  };
};

CommentSchema.methods.serialize = function() {
  return {
    id: this._id,
    commenterName: this.commenterName,
    commentContent: this.commentContent
  }
}

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 8);
};

const User = mongoose.model('User', UserSchema);
const Dog = mongoose.model('Dog', DogSchema);
const Comments = mongoose.model('Comment', CommentSchema)

module.exports = {
  User,
  Dog,
  Comments
};