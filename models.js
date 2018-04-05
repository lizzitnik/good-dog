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
  }
})

const DogSchema = mongoose.Schema({
  heading: {
    type: String
  },
  breed: {
    type: String
  },
  symptoms: {
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
    heading: this.heading,
    breed: this.breed,
    symptoms: this.symptoms
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 8);
};

const User = mongoose.model('User', UserSchema);
const Dog = mongoose.model('Dog', DogSchema);

module.exports = {
  User,
  Dog
};