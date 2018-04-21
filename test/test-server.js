const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

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
  DATABASE_URL,
  JWT_SECRET
} = require('../config')

const expect = chai.expect;

chai.use(chaiHttp);

describe('Dog', function() {
  before(function() {
    return runServer(DATABASE_URL);
  });

  beforeEach('Dog', function() {

  })

  after(function() {
    return closeServer();
  });
  describe('GET endpoint', function() {
    let token;
    beforeAll(() => {
      // Setup a user
      User.create({
        username: "test",
        password: "12345678",
        name: "Test"
      }).then(user => {
        // make a token
        token = jwt.sign(user.serialize(), JWT_SECRET)
        token = `JWT ${token}`
      })
    })

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
      let res;
      return chai.request(app)
        .get('/dogs/my')
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
      const newDog = {
        dogName: 'Morgan',
        dogBreed: 'Hound',
        symptom: 'Dry Nose'
      };

      return chai.request(app)
        .post('/dogs')
        .send(newDog)
        .then(function(res) {
          expect(res).to.have.status(201);
        });
    });

    it('should add a new user', function() {
      const newUser = {
        username: 'mcgill',
        password: 'doggo45'
      }

      return chai.request(app)
        .post('/users')
        .send(newUser)
        .then(function(res) {
          expect(res).to.have.status(201);
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
    it('should update dogs on PUT', function() {
      const updateData = {
        attending: 2
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
          expect(res).to.have.status(204);
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