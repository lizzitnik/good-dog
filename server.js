require('dotenv').config();

const bodyParser = require('body-parser');

const {
  PORT,
  DATABASE_URL
} = require('./config');

const express = require('express');
const app = express();
const passport = require('passport');

const usersRouter = require('./routers/userRouter');
const authRouter = require('./routers/authRouter');
const dogRouter = require('./routers/dogRouter');
const commentRouter = require('./routers/commentRouter')
const {
  localStrategy,
  jwtStrategy
} = require('./routers/authStrategies');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

app.use(express.static('public'));
app.use(bodyParser.json());

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/dogs', dogRouter);
app.use('/comments', commentRouter);

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

const jwtAuth = passport.authenticate('jwt', {
  session: false
});

app.get('/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'rosebud'
  });
});

app.use('*', (req, res) => {
  return res.status(404).json({
    message: 'Not Found'
  });
});



let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve(server);
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
};


module.exports = {
  app,
  runServer,
  closeServer
};