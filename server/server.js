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


var users = [
  { id: 1, email: 'kdk@naver.com', password: '123' },
  { id: 2, email: 'hjh@naver.com', password: '123' },
  { id: 3, email: 'kja@naver.com', password: '123' },
  { id: 4, email: 'khk@naver.com', password: '123' },
];
var userID = 5;
app.get('/api/users', (req, res) => {
  res.json(users);
});
app.get('/api/users/:id', (req, res) => {
  res.json(users.find(item => item.id === +req.params.id));
});
app.put('/api/users/:id', (req, res) => {
  let i = users.findIndex(item => item.id === +req.params.id);
  users[i] = req.body;
  res.send();
});
app.post('/api/users', (req, res) => {
  let newHero = req.body;
  newHero['id'] = userID ++;
  users.push(newHero);
  res.json(newHero);
});
app.delete('/api/users/:id', (req, res) => {
  users = users.filter(h => h.id !== +req.params.id);
  res.send();
});

var proceedings = [
  { id: 1, date: new Date(2016,5,24,11,33,30,0), title: 'dummy1', content: 'dummy1', decisions:[1] },
  { id: 2, date: new Date(2016,6,24,11,33,30,0), title: 'dummy2', content: 'dummy2', decisions:[2] },
  { id: 3, date: new Date(2016,7,24,11,33,30,0), title: 'dummy3', content: 'dummy3', decisions:[3] },
  { id: 4, date: new Date(2016,8,24,11,33,30,0), title: 'dummy4', content: 'dummy4', decisions:[4] },
  { id: 5, date: new Date(2016,9,24,11,33,30,0), title: 'dummy5', content: 'dummy5', decisions:[5] }
];
var proceedingID = 6;
app.get('/api/proceedings', (req, res) => {
  res.json(proceedings);
});
app.get('/api/proceedings/:id', (req, res) => {
  res.json(proceedings.find(item => item.id === +req.params.id));
});
app.put('/api/proceedings/:id', (req, res) => {
  let i = proceedings.findIndex(item => item.id === +req.params.id);
  proceedings[i] = req.body;
  res.send();
});
app.post('/api/proceedings', (req, res) => {
  let newProceeding = req.body;
  newProceeding['id'] = proceedingID ++;
  proceedings.push(newProceeding);
  res.json(newProceeding);
});
app.delete('/api/proceedings/:id', (req, res) => {
  proceedings = proceedings.filter(h => h.id !== +req.params.id);
  res.send();
});

var decisions = [
  { id: 1, activities:[1,6,10], content: '소모임 활성화 방안 - 녹색평론 읽기모임'},
  { id: 2, activities:[2,8], content: '소식지 발송 활동'},
  { id: 3, activities:[3], content: '한달에 한번 정보공개청구'},
  { id: 4, activities:[4,5], content: 'dummy4'},
  { id: 5, activities:[7,9], content: 'dummy5'}
];
var decisionID = 6;
app.get('/api/decisions', (req, res) => {
  res.json(decisions);
});
app.get('/api/decisions/:id', (req, res) => {
  res.json(decisions.find(item => item.id === +req.params.id));
});
app.put('/api/decisions/:id', (req, res) => {
  let i = decisions.findIndex(item => item.id === +req.params.id);
  decisions[i] = req.body;
  res.send();
});
app.post('/api/decisions', (req, res) => {
  let newHero = req.body;
  newHero['id'] = decisionID ++;
  decisions.push(newHero);
  res.json(newHero);
});
app.delete('/api/decisions/:id', (req, res) => {
  decisions = decisions.filter(h => h.id !== +req.params.id);
  res.send();
});

var activities = [
  { id: 1, date: new Date(2016,5,24,11,33,30,0), content: 'hahaha', receipts: [1,10] },
  { id: 2, date: new Date(2016,6,2,11,33,30,0), content: 'hohoho', receipts: [2,10] },
  { id: 3, date: new Date(2016,6,24,11,33,30,0), content: 'hohoho', receipts: [3,10] },
  { id: 4, date: new Date(2016,7,4,11,33,30,0), content: 'hohoho', receipts: [4,10] },
  { id: 5, date: new Date(2016,7,24,11,33,30,0), content: 'hohoho', receipts: [5,10] },
  { id: 6, date: new Date(2016,8,2,11,33,30,0), content: 'hohoho', receipts: [6,10] },
  { id: 7, date: new Date(2016,8,24,11,33,30,0), content: 'hohoho', receipts: [7,10] },
  { id: 8, date: new Date(2016,9,4,11,33,30,0), content: 'hohoho', receipts: [8,10] },
  { id: 9, date: new Date(2016,9,24,11,33,30,0), content: 'hohoho', receipts: [9,10] },
  { id: 10, date: new Date(2016,10,24,11,33,30,0), content: 'hohoho', receipts: [10,11] }
];
var activityID = 11;
app.get('/api/activities', (req, res) => {
  res.json(activities);
});
app.get('/api/activities/:id', (req, res) => {
  res.json(activities.find(item => item.id === +req.params.id));
});
app.put('/api/activities/:id', (req, res) => {
  let i = activities.findIndex(item => item.id === +req.params.id);
  activities[i] = req.body;
  res.send();
});
app.post('/api/activities', (req, res) => {
  let newHero = req.body;
  newHero['id'] = activityID ++;
  activities.push(newHero);
  res.json(newHero);
});
app.delete('/api/activities/:id', (req, res) => {
  activities = activities.filter(h => h.id !== +req.params.id);
  res.send();
});

var receipts = [
  { id: 1, date: new Date(2016,5,24,11,33,30,0), imageUrl: 'dummy' },
  { id: 2, date: new Date(2016,5,28,11,33,30,0), imageUrl: 'dummy' },
  { id: 3, date: new Date(2016,6,24,11,33,30,0), imageUrl: 'dummy' },
  { id: 4, date: new Date(2016,6,27,11,33,30,0), imageUrl: 'dummy' },
  { id: 5, date: new Date(2016,7,24,11,33,30,0), imageUrl: 'dummy' },
  { id: 6, date: new Date(2016,7,29,11,33,30,0), imageUrl: 'dummy' },
  { id: 7, date: new Date(2016,8,24,11,33,30,0), imageUrl: 'dummy' },
  { id: 8, date: new Date(2016,8,25,11,33,30,0), imageUrl: 'dummy' },
  { id: 9, date: new Date(2016,9,24,11,33,30,0), imageUrl: 'dummy' },
  { id: 10, date: new Date(2016,9,24,11,33,30,0), imageUrl: 'dummy' },
  { id: 11, date: new Date(2016,10,24,11,33,30,0), imageUrl: 'dummy' }
];
var receiptID = 12;
app.get('/api/receipts', (req, res) => {
  res.json(receipts);
});
app.get('/api/receipts/:id', (req, res) => {
  res.json(receipts.find(item => item.id === +req.params.id));
});
app.put('/api/receipts/:id', (req, res) => {
  let i = receipts.findIndex(item => item.id === +req.params.id);
  receipts[i] = req.body;
  res.send();
});
app.post('/api/receipts', (req, res) => {
  let newHero = req.body;
  newHero['id'] = receiptID ++;
  receipts.push(newHero);
  res.json(newHero);
});
app.delete('/api/receipts/:id', (req, res) => {
  receipts = receipts.filter(h => h.id !== +req.params.id);
  res.send();
});



app.get('*', (req, res) => {
  res.redirect('/');
});



app.listen(app.get('port'), function () {
  debug('Node app is running on port', app.get('port'));
});


