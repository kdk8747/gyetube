var express = require('express');
var path = require('path');
var app = express();

app.set('port', (process.env.PORT || 5000));

var __public = path.resolve(__dirname + '/../dist');


app.get('/', function (request, response) {
  console.log(__public + '/index.html');
  response.sendFile(__public + '/index.html');
});


app.get('*.js', function (request, response) {
  if (request.url.substr(1, 3) == 'app') {
    request.url = __public + request.url;
  }
  else {
    request.url = __public + request.url + '.gz';
    response.set('Content-Encoding', 'gzip');
  }
  console.log(request.url);
  response.sendFile(request.url);
});


app.get('/crash', function (request, response) {
  response.send('res=11112');
});


app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});


