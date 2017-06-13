var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/../dist'));
app.use(express.static(__dirname + '/..'));


app.get('/', function(request, response) {
    response.sendFile('index.html');
});

app.get('/times', function(request, response) {
    var result = ''
    var times = process.env.TIMES || 5
    for (i=0; i < times; i++)
      result += i + ' ';
  response.send(result);
});

app.get('*.js', function (request, response, next) {
  request.url = request.url + '.gz';
  response.set('Content-Encoding', 'gzip');
  next();
});

app.get('/db', function (request, response) {
    var mysql = require('mysql');
    var connection = mysql.createConnection(process.env.JAWSDB_MARIA_URL);

    connection.connect();

    connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
        if (err) throw err;

        console.log('The solution is: ', rows[0].solution);
    });

    connection.end();
    response.send('good');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


