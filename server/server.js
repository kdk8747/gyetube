const express = require('express');
const expressStaticGzip = require('express-static-gzip');
const bodyParser = require('body-parser');
const path = require('path');
const debug = require('debug')('server');
const app = express();

app.set('port', (process.env.PORT || 5000));

const __public = path.resolve(__dirname + '/../public');

app.use('/', expressStaticGzip(__public));
app.use('/dashboard', expressStaticGzip(__public));
app.use('/heroes', expressStaticGzip(__public));
app.use('/detail/*', expressStaticGzip(__public));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


var HEROES = [
  { id: 11, name: 'Mr. Nice' },
  { id: 12, name: 'Narco' },
  { id: 13, name: 'Bombasto' },
  { id: 14, name: 'Celeritas' },
  { id: 15, name: 'Magneta' },
  { id: 16, name: 'RubberMan' },
  { id: 17, name: 'Dynama' },
  { id: 18, name: 'Dr IQ' },
  { id: 19, name: 'Magma' },
  { id: 20, name: 'Tornado' }
];
var ID = 21;
app.get('/api/heroes', (req, res) => {
  res.json(HEROES);
});
app.get('/api/heroes/:id', (req, res) => {
  res.json(HEROES.find(item => item.id === +req.params.id));
});
app.put('/api/heroes/:id', (req, res) => {
  let i = HEROES.findIndex(item => item.id === +req.params.id);
  HEROES[i] = req.body;
  res.send();
});
app.post('/api/heroes', (req, res) => {
  let newHero = req.body;
  newHero['id'] = ID ++;
  HEROES.push(newHero);
  res.json(newHero);
});
app.delete('/api/heroes/:id', (req, res) => {
  HEROES = HEROES.filter(h => h.id !== +req.params.id);
  res.send();
});

app.get('/app/heroes', (req, res) => {
  let qname = req.query.name;
  let match = HEROES.filter(h => h.name.substr(0, qname.length) === qname);
  res.json(match);
});


app.listen(app.get('port'), function () {
  debug('Node app is running on port', app.get('port'));
});


