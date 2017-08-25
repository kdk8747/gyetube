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


app.use('/.well-known/acme-challenge/XUjRWV8U8j945zn48YuWazD3c_SAX6SiEqnSo_vJssY',
(req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('XUjRWV8U8j945zn48YuWazD3c_SAX6SiEqnSo_vJssY.hb-F3oClErLHI0Su7X0ltruYKmKLf8Hi5hLSXl9b4Qg');
  res.end();
});
app.use('/', expressStaticGzip(__public)); // FIX ME (performance)
app.use('/build', expressStaticGzip(__public)); // FIX ME (performance)
app.use('/login', expressStaticGzip(__public)); // FIX ME (performance)
app.use('/suwongreenparty', expressStaticGzip(__public)); // FIX ME (performance)

require('./middlewares/passports').initialize();

app.use('/api/v1.0/', require('./middlewares/authentication'), require('./routes/api'));
app.use('/api/v1.0/users', require('./routes/api/users'));


app.get('*', (req, res) => {
  res.redirect('/');
});

http.createServer(app).listen(__port, function () {
  debug('Express server listening on port ' + __port);
});
