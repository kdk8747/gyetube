/* =======================
    LOAD THE DEPENDENCIES
==========================*/
const express = require('express');
const expressStaticGzip = require('express-static-gzip');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
//const sslRedirect = require('heroku-ssl-redirect');
const debug = require('debug')('server');


/* =======================
    LOAD THE CONFIG
==========================*/
const __public = path.resolve(__dirname + '/../www');
const __port = process.env.PORT || 5000;


/* =======================
    EXPRESS CONFIGURATION
==========================*/
const app = express();
const oneHour = 3600000;    // 3600000msec == 1hour
app.use(express.static('www', { maxAge: oneHour })); // Client-side file caching

function setCache (req, res, next) {
  res.setHeader('Cache-Control', 'public, max-age=3');
  next();
}


// parse JSON and url-encoded query
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// print the request log on console
if (process.env.NODE_ENV != 'production')
  app.use(require('morgan')('dev'));


//app.use(sslRedirect(['production'], 301));
app.use('/', expressStaticGzip(__public)); // FIX ME (performance)

require('./express-middlewares/passports').initialize();

app.use('/api/v1.0/groups', setCache, require('./express-middlewares/authentication'), require('./routes/api'));
app.use('/api/v1.0/users', setCache, require('./routes/api/users'));


app.get('*', (req, res) => {
  res.redirect('/');
});

http.createServer(app).listen(__port, function () {
  debug('Express server listening on port ' + __port);
});
