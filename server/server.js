const express = require('express');
const expressStaticGzip = require('express-static-gzip');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const debug = require('debug')('server');
const app = express();

app.set('port', (process.env.PORT || 5000));

const __public = path.resolve(__dirname + '/../public');

app.use('/', expressStaticGzip(__public));

app.use(bodyParser.urlencoded({ extended: true }));
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
  newHero['id'] = userID++;
  users.push(newHero);
  res.json(newHero);
});
app.delete('/api/users/:id', (req, res) => {
  users = users.filter(h => h.id !== +req.params.id);
  res.send();
});

var proceedings = [
  { id: 1, prevId: 0, state: 0, createdDate: new Date(2016, 5, 24, 11, 33, 30, 0), meetingDate: new Date(2016, 5, 24, 11, 33, 30, 0), title: 'dummy1', content: 'dummy1', childPolicies: [1] },
  { id: 2, prevId: 0, state: 0, createdDate: new Date(2016, 6, 24, 11, 33, 30, 0), meetingDate: new Date(2016, 6, 24, 11, 33, 30, 0), title: 'dummy2', content: 'dummy2', childPolicies: [2] },
  { id: 3, prevId: 0, state: 0, createdDate: new Date(2016, 7, 24, 11, 33, 30, 0), meetingDate: new Date(2016, 7, 24, 11, 33, 30, 0), title: 'dummy3', content: 'dummy3', childPolicies: [3] },
  { id: 4, prevId: 0, state: 0, createdDate: new Date(2016, 8, 24, 11, 33, 30, 0), meetingDate: new Date(2016, 8, 24, 11, 33, 30, 0), title: 'dummy4', content: 'dummy4', childPolicies: [4] },
  { id: 5, prevId: 0, state: 0, createdDate: new Date(2016, 9, 24, 11, 33, 30, 0), meetingDate: new Date(2016, 9, 24, 11, 33, 30, 0), title: 'dummy5', content: 'dummy5', childPolicies: [5] }
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
  newProceeding['id'] = proceedingID++;
  proceedings.push(newProceeding);
  res.json(newProceeding);
});
app.delete('/api/proceedings/:id', (req, res) => {
  proceedings = proceedings.filter(h => h.id !== +req.params.id);
  res.send();
});

var policies = [
  { id: 1, prevId: 0, state: 0, createdDate: new Date(2016, 5, 24, 11, 33, 30, 0), expiryDate: new Date(2018, 5, 24, 11, 33, 30, 0), parentProceeding: 1, childActivities: [1, 6, 10], content: '소모임 활성화 방안 - 녹색평론 읽기모임' },
  { id: 2, prevId: 0, state: 0, createdDate: new Date(2016, 6, 24, 11, 33, 30, 0), expiryDate: new Date(2018, 5, 24, 11, 33, 30, 0), parentProceeding: 2, childActivities: [2, 8], content: '소식지 발송 활동' },
  { id: 3, prevId: 0, state: 0, createdDate: new Date(2016, 7, 24, 11, 33, 30, 0), expiryDate: new Date(2018, 5, 24, 11, 33, 30, 0), parentProceeding: 3, childActivities: [3], content: '한달에 한번 정보공개청구' },
  { id: 4, prevId: 0, state: 0, createdDate: new Date(2016, 8, 24, 11, 33, 30, 0), expiryDate: new Date(2018, 5, 24, 11, 33, 30, 0), parentProceeding: 4, childActivities: [4, 5], content: 'dummy4' },
  { id: 5, prevId: 0, state: 0, createdDate: new Date(2016, 9, 24, 11, 33, 30, 0), expiryDate: new Date(2018, 5, 24, 11, 33, 30, 0), parentProceeding: 5, childActivities: [7, 9], content: 'dummy5' }
];
var decisionID = 6;
app.get('/api/policies', (req, res) => {
  res.json(policies);
});
app.get('/api/policies/:id', (req, res) => {
  res.json(policies.find(item => item.id === +req.params.id));
});
app.put('/api/policies/:id', (req, res) => {
  let i = policies.findIndex(item => item.id === +req.params.id);
  policies[i] = req.body;
  res.send();
});
app.post('/api/policies', (req, res) => {
  let newPolicy = req.body;
  newPolicy['id'] = decisionID++;
  policies.push(newPolicy);
  res.json(newPolicy);
});
app.delete('/api/policies/:id', (req, res) => {
  policies = policies.filter(h => h.id !== +req.params.id);
  res.send();
});

var activities = [
  { id: 1, modifiedDate: new Date(2016, 5, 24, 11, 33, 30, 0), activityDate: new Date(2016, 5, 24, 11, 33, 30, 0), content: 'hahaha', parentPolicy: 1, childReceipts: [1] },
  { id: 2, modifiedDate: new Date(2016, 6, 2, 11, 33, 30, 0), activityDate: new Date(2016, 6, 2, 11, 33, 30, 0), content: 'hohoho', parentPolicy: 2, childReceipts: [2] },
  { id: 3, modifiedDate: new Date(2016, 6, 24, 11, 33, 30, 0), activityDate: new Date(2016, 6, 24, 11, 33, 30, 0), content: 'huhoho', parentPolicy: 3, childReceipts: [3] },
  { id: 4, modifiedDate: new Date(2016, 7, 4, 11, 33, 30, 0), activityDate: new Date(2016, 7, 4, 11, 33, 30, 0), content: 'hohuho', parentPolicy: 4, childReceipts: [4] },
  { id: 5, modifiedDate: new Date(2016, 7, 24, 11, 33, 30, 0), activityDate: new Date(2016, 7, 24, 11, 33, 30, 0), content: 'hohohu', parentPolicy: 4, childReceipts: [5] },
  { id: 6, modifiedDate: new Date(2016, 8, 2, 11, 33, 30, 0), activityDate: new Date(2016, 8, 2, 11, 33, 30, 0), content: 'huhuhu', parentPolicy: 1, childReceipts: [6] },
  { id: 7, modifiedDate: new Date(2016, 8, 24, 11, 33, 30, 0), activityDate: new Date(2016, 8, 24, 11, 33, 30, 0), content: 'hohuha', parentPolicy: 5, childReceipts: [7] },
  { id: 8, modifiedDate: new Date(2016, 9, 4, 11, 33, 30, 0), activityDate: new Date(2016, 9, 4, 11, 33, 30, 0), content: 'hohoha', parentPolicy: 2, childReceipts: [8] },
  { id: 9, modifiedDate: new Date(2016, 9, 24, 11, 33, 30, 0), activityDate: new Date(2016, 9, 24, 11, 33, 30, 0), content: 'hahoho', parentPolicy: 5, childReceipts: [9] },
  { id: 10, modifiedDate: new Date(2016, 10, 24, 11, 33, 30, 0), activityDate: new Date(2016, 10, 24, 11, 33, 30, 0), content: 'hahuhu', parentPolicy: 1, childReceipts: [10, 11] }
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
  newHero['id'] = activityID++;
  activities.push(newHero);
  res.json(newHero);
});
app.delete('/api/activities/:id', (req, res) => {
  activities = activities.filter(h => h.id !== +req.params.id);
  res.send();
});

var receipts = [
  { id: 1, modifiedDate: new Date(2016, 5, 24, 11, 33, 30, 0), paymentDate: new Date(2016, 5, 24, 11, 33, 30, 0), memo: 'dummy1', difference: +3000000, imageUrl: 'dummy', parentActivity: 1 },
  { id: 2, modifiedDate: new Date(2016, 5, 28, 11, 33, 30, 0), paymentDate: new Date(2016, 5, 28, 11, 33, 30, 0), memo: 'dummy1', difference: -20000, imageUrl: 'dummy', parentActivity: 2 },
  { id: 3, modifiedDate: new Date(2016, 6, 24, 11, 33, 30, 0), paymentDate: new Date(2016, 6, 24, 11, 33, 30, 0), memo: 'dummy1', difference: -150000, imageUrl: 'dummy', parentActivity: 3 },
  { id: 4, modifiedDate: new Date(2016, 6, 27, 11, 33, 30, 0), paymentDate: new Date(2016, 6, 27, 11, 33, 30, 0), memo: 'dummy1', difference: +360000, imageUrl: 'dummy', parentActivity: 4 },
  { id: 5, modifiedDate: new Date(2016, 7, 24, 11, 33, 30, 0), paymentDate: new Date(2016, 7, 24, 11, 33, 30, 0), memo: 'dummy1', difference: -7500, imageUrl: 'dummy', parentActivity: 5 },
  { id: 6, modifiedDate: new Date(2016, 7, 29, 11, 33, 30, 0), paymentDate: new Date(2016, 7, 29, 11, 33, 30, 0), memo: 'dummy1', difference: +360000, imageUrl: 'dummy', parentActivity: 6 },
  { id: 7, modifiedDate: new Date(2016, 8, 24, 11, 33, 30, 0), paymentDate: new Date(2016, 8, 24, 11, 33, 30, 0), memo: 'dummy1', difference: -20000, imageUrl: 'dummy', parentActivity: 7 },
  { id: 8, modifiedDate: new Date(2016, 8, 25, 11, 33, 30, 0), paymentDate: new Date(2016, 8, 25, 11, 33, 30, 0), memo: 'dummy1', difference: +360000, imageUrl: 'dummy', parentActivity: 8 },
  { id: 9, modifiedDate: new Date(2016, 9, 24, 11, 33, 30, 0), paymentDate: new Date(2016, 9, 24, 11, 33, 30, 0), memo: 'dummy1', difference: -20000, imageUrl: 'dummy', parentActivity: 9 },
  { id: 10, modifiedDate: new Date(2016, 9, 24, 11, 33, 30, 0), paymentDate: new Date(2016, 9, 24, 11, 33, 30, 0), memo: 'dummy1', difference: +360000, imageUrl: 'dummy', parentActivity: 10 },
  { id: 11, modifiedDate: new Date(2016, 10, 24, 11, 33, 30, 0), paymentDate: new Date(2016, 10, 24, 11, 33, 30, 0), memo: 'dummy1', difference: +360000, imageUrl: 'dummy', parentActivity: 10 }
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
  newHero['id'] = receiptID++;
  receipts.push(newHero);
  res.json(newHero);
});
app.delete('/api/receipts/:id', (req, res) => {
  receipts = receipts.filter(h => h.id !== +req.params.id);
  res.send();
});


function getSignatureKey(key, dateStamp, regionName, serviceName) {
  let kDate = crypto.createHmac('sha256', 'AWS4' + key).update(dateStamp).digest();
  let kRegion = crypto.createHmac('sha256', kDate).update(regionName).digest();
  let kService = crypto.createHmac('sha256', kRegion).update(serviceName).digest();
  let kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
  return kSigning;
}

app.get('/api/sign-s3/:category(receipts|documents|photos)', (req, res) => {
  const amzDate = req.query['amz-date'];
  let authDate = amzDate.split('T')[0];
  let credential = `${process.env.AWS_ACCESS_KEY_ID}/${authDate}/ap-northeast-2/s3/aws4_request`;
  let keyPath = 'suwongreenparty/' + req.params.category + '/';

  let expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + 3);
  let policy = {
    'expiration': expiration,
    'conditions': [
      { 'bucket': 'grassroots-groups' },
      ['starts-with', '$key', keyPath],
      { 'acl': 'public-read' },
      { 'x-amz-meta-uuid': '14365123651274' },
      { 'x-amz-server-side-encryption': 'AES256' },
      { 'success_action_status': '201' },
      { 'x-amz-credential': credential },
      { 'x-amz-algorithm': 'AWS4-HMAC-SHA256' },
      { 'x-amz-date': amzDate }
    ]
  };
  if (req.params.category != 'documents')
    policy.conditions.push(['starts-with', '$Content-Type', 'image/']);

  let policyString = JSON.stringify(policy);
  let stringToSign = new Buffer(policyString).toString('base64');
  let signingKey = getSignatureKey(process.env.AWS_SECRET_ACCESS_KEY, authDate, 'ap-northeast-2', 's3', 'aws4_request');
  let signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');

  let returnData = {
    stringToSign: stringToSign,
    signature: signature,
    keyPath: keyPath,
    credential: credential
  };
  res.write(JSON.stringify(returnData));
  res.end();
});


app.get('/oauth', (req, res) => {
  let code = req.query['code'];
  let state = req.query['state'];

  let returnData = {
    code: code,
    state: state
  };

  const options = {
    hostname: 'kauth.kakao.com/',
    port: 443,
    path: '/oauth/token?grant_type=authorization_code\
  &client_id=e377bae94f2edc3f3a3af327b3361ce5\
  &redirect_uri=http://grassroots.kr/oauth\
  &code=' + code,
    method: 'POST'
  };

  http.request(options, (req) => {
    debug('post from /oauth');
  }).on('error', (e) => {
    debug(`Got error: ${e.message}`);
  });
});



app.get('*', (req, res) => {
  res.redirect('/');
});



app.listen(app.get('port'), () => {
  debug('Node app is running on port', app.get('port'));
});


