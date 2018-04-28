const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser")
const jsonParser = bodyParser.json()

const {
  app,
  jwtAuth,
  runServer,
  closeServer
} = require('../server');
const {
  User,
  Dog,
  Comments
} = require('../models');
const {
  DATABASE_TEST_URL,
  JWT_SECRET
} = require('../config')

const expect = chai.expect;

chai.use(chaiHttp);

describe('Dog', function() {

  const username = 'exampleUser';
  const password = 'examplePass';
  const firstName = 'Example';
  const lastName = 'User';

  before(function() {
    return runServer(DATABASE_TEST_URL);
  });

  after(function() {
    return closeServer();
  });

  beforeEach(function() {
    return User.hashPassword(password).then(password =>
      User.create({
        username,
        password,
        firstName,
        lastName
      })
    );
  });

  afterEach(function() {
    return User.remove({});
  });


  describe('GET endpoint', function() {

    it('should return all existing dogs', function() {
      let res;
      return chai.request(app)
        .get('/dogs')
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(200);
        })

    });

    it('should return all my dogs', function() {
      const token = jwt.sign({
          user: {
            username,
            firstName,
            lastName
          }
        },
        JWT_SECRET, {
          algorithm: 'HS256',
          subject: username,
          expiresIn: '7d'
        }
      );
      let res;
      return chai.request(app)
        .get('/dogs/my')
        .set('authorization', `Bearer ${token}`)
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(200);
        })
    })

    it('should return all existing users', function() {
      let res;
      return chai.request(app)
        .get('/users')
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(200);
        })
    });
  });


  describe('POST endpoints', function() {
    it('should add a new dog', function() {
      const token = jwt.sign({
          user: {
            username,
            firstName,
            lastName
          }
        },
        JWT_SECRET, {
          algorithm: 'HS256',
          subject: username,
          expiresIn: '7d'
        }
      );

      const newDog = {
        dogName: 'Morgan',
        dogBreed: 'Hound',
        symptom: 'Dry Nose'
      };

      return chai.request(app)
        .post('/dogs')
        .send(newDog)
        .set('authorization', `Bearer ${token}`)
        .then(function(res) {
          expect(res).to.have.status(201);
        });
    });

    it.only('should add a new user', function() {

      return chai.request(app)
        .post('/users')
        .send({
          username,
          password,
          firstName,
          lastName
        })
        .then(res => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys(
            'username',
            'firstName',
            'lastName'
          );
          expect(res.body.username).to.equal(username);
          expect(res.body.firstName).to.equal(firstName);
          expect(res.body.lastName).to.equal(lastName);
          return User.findOne({
            username
          });
        })
        .then(user => {
          expect(user).to.not.be.null;
          expect(user.firstName).to.equal(firstName);
          expect(user.lastName).to.equal(lastName);
          return user.validatePassword(password);
        })
        .then(passwordIsCorrect => {
          expect(passwordIsCorrect).to.be.true;
        });
    })

    it('should add a new comment', function() {
      const newComment = {
        commenterName: 'Ryan',
        commentContent: 'whatever you want'
      }

      return chai.request(app)
        .post('/comments')
        .send(newComment)
        .then(function(res) {
          expect(res).to.have.status(201);
        });
    })
  })

  describe('PUT endpoint', function() {
    before(function() {
      Dog.create({
        dogName: 'Borgan',
        dogBreed: 'Hound',
        symptom: 'Dry Nose',
        additionalInfo: 'blah blah'
      })
    })
    it('should update dogs on PUT', function() {
      const updateData = {
        symptom: 'whatevs',
        additionalInfo: 'yeah yeah'
      };

      return Dog
        .findOne()
        .then(function(dog) {
          updateData.id = dog.id;
          return chai.request(app)
            .put(`/dogs/${dog.id}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res.body.symptom).to.equal('whatevs');
        });

    });
  })

  describe('DELETE endpoint', function() {
    it('should delete a dog by id', function() {
      let dog;

      return Dog
        .findOne()
        .then(function(_dog) {
          dog = _dog;
          return chai.request(app)
            .delete(`/dogs/${dog.id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
        })
    })
  })

});