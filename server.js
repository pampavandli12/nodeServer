const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();
const cors = require('cors');

// API file for interacting with MongoDB
const api = require('./server/routes/api');

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.options('*', cors());

// API location
app.use('/api', api);

//Set Port
const port = process.env.PORT || 3000; // CHange to meet Heroku
app.listen(port, () => console.log('server started at port 3000'));
