require('dotenv').config();
const cors = require('cors');
const debug = require('debug')('TimeLocker:server');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const router = require('./routes.js');

// initialize server for appropriate dbms
const app = module.exports = express();
const PORT = process.env.PORT || 3000;
const dbms = process.env.DBMS || 'mysql';

// session
const options = {
  host            : process.env.DB_HOST,
  port            : process.env.DB_PORT,
  user            : process.env.DB_USER,
  password        : process.env.DB_PASS,
  database        : process.env.DB_NAME,
};

debug(options);

if (dbms === 'mysql') {
  const sessionStore = new MySQLStore(options);

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cors());

  app.use(session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: true,
    rolling: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      domain: 'localhost:8080',
      path: '/',
      secure: false,
    },
  }));

  app.use('/api/keepsafe', router);
  app.set('port', PORT);
  app.listen(app.get('port'), () => (
    console.log(`Node app started. Listening on port ${PORT}`)
  ));
}
