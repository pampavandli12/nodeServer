require('dotenv').config();

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const users = require('../models/users');
const Token = require('../models/token');
const tasklist = require('../models/tasklist');
var md5 = require('md5');
const jwt = require('jsonwebtoken');
const config = require('./config');

// Connect
const mongoUrl =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/dailyTask'; // Changed to meet Heroku
mongoose.connect(mongoUrl);

// Create Token
const createAccessToken = (user) => {
  return jwt.sign(user, config.AccessToken, { expiresIn: '24h' });
};
//Check Token function
const authenticateToken = (req, res, next) => {
  let header = req.headers;
  let token = header && header['authorization'].split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, config.AccessToken, (err, user) => {
    if (err) return res.sendStatus(403);
    next();
  });
};

// Get users
router.all('/signin', (req, res) => {
  var userID = req.body.userId;
  var password = md5(req.body.password);
  console.log('posting to signin');
  users.find({ userID: userID }).exec(function (err, results) {
    if (err) {
      res.status(500).send({ message: 'Something went wrong' });
    }
    if (results.length > 0) {
      if (results[0].password === password) {
        var data = {
          userID: results[0].userID,
          username: results[0].username,
          message: 'Success',
          status: 1,
        };
        const token = createAccessToken({
          userID: results[0].userID,
          username: results[0].username,
        });
        res.send({ data, token });
      } else {
        res.status(401).send({ message: 'Password is incorrect' });
      }
    } else {
      res.status(401).send({ message: 'Email is not registered' });
    }
  });
});

router.all('/signup', (req, res) => {
  var username = req.body.username;
  var userID = req.body.userID;
  var password = md5(req.body.password);
  users.find({ userID: userID }, (err, results) => {
    if (err) {
      res.status(500).send({ message: 'Something went wrong' });
    } else {
      if (results.length > 0) {
        res.status(401).send({ message: 'Email already registered' });
      } else {
        users.create(
          { username: username, userID: userID, password: password },
          (err, results) => {
            if (err) {
              res.status(500).send({ message: 'Something went wrong' });
            } else {
              const token = createAccessToken({
                userID: userID,
                username: username,
              });
              var data = {
                userID: userID,
                username: username,
              };
              res.send({ data, token });
            }
          }
        );
      }
    }
  });
});
//Add New Task
router.all('/addTask', authenticateToken, (req, res) => {
  const userID = req.body.userID;
  const username = req.body.username;
  const headline = req.body.headline;
  const description = req.body.description;
  const date = req.body.date;
  tasklist.create(
    {
      username: username,
      userID: userID,
      headline: headline,
      description: description,
      date: date,
    },
    (err, results) => {
      if (err) {
        res.status(500).send({ message: 'Something went wrong' });
      } else {
        tasklist.find({}, (err, results) => {
          if (err) {
            res.status(500).send({ message: 'Something went wrong' });
          } else {
            res.send({ data: results });
          }
        });
      }
    }
  );
});

//Get Task List
router.all('/getTaskList', authenticateToken, (req, res) => {
  tasklist.find({}, (err, results) => {
    if (err) {
      res.status(500).send({ message: 'Something went wrong!' });
    } else {
      res.send({ data: results });
    }
  });
});

//Edit Task List
router.all('/editTaskList', authenticateToken, (req, res) => {
  const userID = req.body.userID;
  const username = req.body.username;
  const headline = req.body.headline;
  const description = req.body.description;
  const date = req.body.date;
  const id = req.body.id;
  tasklist.updateOne(
    { _id: ObjectID(id) },
    {
      username: username,
      userID: userID,
      headline: headline,
      description: description,
      date: date,
    },
    (err, results) => {
      if (err) {
        res.status(500).send({ message: 'Something went wrong' });
      } else {
        tasklist.find({}, (err, results) => {
          if (err) {
            res.status(500).send({ message: 'Something went wrong' });
          } else {
            res.send({ status: 1, data: results });
          }
        });
      }
    }
  );
});

module.exports = router;
