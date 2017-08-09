/* =======================
    LOAD THE DEPENDENCIES
==========================*/
const express = require('express');
const expressStaticGzip = require('express-static-gzip');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
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


// parse JSON and url-encoded query
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// print the request log on console
if (process.env.NODE_ENV != 'production')
  app.use(require('morgan')('dev'));

app.use(express.static(__public));
//app.use('/', expressStaticGzip(__public)); // FIX ME (performance)
//app.use('/login', expressStaticGzip(__public)); // FIX ME (performance)
//app.use('/suwongreenparty', expressStaticGzip(__public)); // FIX ME (performance)

require('./middlewares/passports').initialize();

app.use('/api/v1.0/', require('./middlewares/authentication'), require('./routes/api'));
app.use('/api/v1.0/users', require('./routes/api/users'));


app.get('*', (req, res) => {
  res.redirect('/');
});

http.createServer(app).listen(__port, function () {
  debug('Express server listening on port ' + __port);
});
