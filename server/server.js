var express = require('express');
var expressStaticGzip = require('express-static-gzip');
var path = require('path');
var debug = require('debug')('server');
var app = express();

app.set('port', (process.env.PORT || 5000));

var __public = path.resolve(__dirname + '/../public');

app.use('/', expressStaticGzip(__public));


app.get('/crash', function (request, response) {
  response.send('res=11112');
});


app.listen(app.get('port'), function () {
  debug('Node app is running on port', app.get('port'));
});


