
var receipts = [
  {
    id: 1,
    creator: 'dk',
    modifiedDate: new Date("2017-10-06T19:30:00+09:00"),
    paymentDate: new Date("2016-01-01T19:30:00+09:00"),
    memo: '2015년 수원녹색당 이월금',
    difference: +1229000,
    imageUrl: ''
    //parentActivity: 1
  },
  {
    id: 2,
    creator: 'dk',
    modifiedDate: new Date("2017-10-06T19:30:00+09:00"),
    paymentDate: new Date("2016-03-07T19:30:00+09:00"),
    memo: '2016년 총선 선거기금',
    difference: -1229000,
    imageUrl: '',
    //parentActivity: 1
    parentDecision: 3
  },
];
var receiptID = 12;

var receipts2 = [
  { id: 1, creator: '1', modifiedDate: new Date(2016, 5, 24, 11, 33, 30, 0), paymentDate: new Date(2016, 5, 24, 11, 33, 30, 0), memo: '5월 당비입금', difference: +3000000, imageUrl: 'dummy', parentActivity: 1 },
  { id: 2, creator: '1', modifiedDate: new Date(2016, 5, 28, 11, 33, 30, 0), paymentDate: new Date(2016, 5, 28, 11, 33, 30, 0), memo: 'dummy1', difference: -20000, imageUrl: 'dummy', parentActivity: 2 },
  { id: 3, creator: '1', modifiedDate: new Date(2016, 6, 24, 11, 33, 30, 0), paymentDate: new Date(2016, 6, 24, 11, 33, 30, 0), memo: 'dummy1', difference: -150000, imageUrl: 'dummy', parentActivity: 3 },
  { id: 4, creator: '1', modifiedDate: new Date(2016, 6, 27, 11, 33, 30, 0), paymentDate: new Date(2016, 6, 27, 11, 33, 30, 0), memo: '6월 당비입금', difference: +360000, imageUrl: 'dummy', parentActivity: 4 },
  { id: 5, creator: '1', modifiedDate: new Date(2016, 7, 24, 11, 33, 30, 0), paymentDate: new Date(2016, 7, 24, 11, 33, 30, 0), memo: 'dummy1', difference: -7500, imageUrl: 'dummy', parentActivity: 5 },
  { id: 6, creator: '1', modifiedDate: new Date(2016, 7, 29, 11, 33, 30, 0), paymentDate: new Date(2016, 7, 29, 11, 33, 30, 0), memo: '7월 당비입금', difference: +360000, imageUrl: 'dummy', parentActivity: 6 },
  { id: 7, creator: '1', modifiedDate: new Date(2016, 8, 24, 11, 33, 30, 0), paymentDate: new Date(2016, 8, 24, 11, 33, 30, 0), memo: 'dummy1', difference: -20000, imageUrl: 'dummy', parentActivity: 7 },
  { id: 8, creator: '1', modifiedDate: new Date(2016, 8, 25, 11, 33, 30, 0), paymentDate: new Date(2016, 8, 25, 11, 33, 30, 0), memo: '8월 당비입금', difference: +360000, imageUrl: 'dummy', parentActivity: 8 },
  { id: 9, creator: '1', modifiedDate: new Date(2016, 9, 24, 11, 33, 30, 0), paymentDate: new Date(2016, 9, 24, 11, 33, 30, 0), memo: 'dummy1', difference: -20000, imageUrl: 'dummy', parentActivity: 9 },
  { id: 10, creator: '1', modifiedDate: new Date(2016, 9, 24, 11, 33, 30, 0), paymentDate: new Date(2016, 9, 24, 11, 33, 30, 0), memo: '9월 당비입금', difference: +360000, imageUrl: 'dummy', parentActivity: 10 },
  { id: 11, creator: '1', modifiedDate: new Date(2016, 10, 24, 11, 33, 30, 0), paymentDate: new Date(2016, 10, 24, 11, 33, 30, 0), memo: '10월 당비입금', difference: +360000, imageUrl: 'dummy', parentActivity: 10 }
];
var receiptID2 = 12;

exports.getAll = (req, res) => {
  if (req.params.group === 'suwongreenparty')
    res.json(receipts);
  else
    res.json(receipts2);
}
exports.getBalance = (req, res) => {
  if (req.params.group === 'suwongreenparty')
    res.json(0);
  else
    res.json(0);
}
exports.getByID = (req, res) => {
  if (req.params.group === 'suwongreenparty')
    res.json(receipts.find(item => item.id === +req.params.id));
  else
    res.json(receipts2.find(item => item.id === +req.params.id));
}
exports.updateByID = (req, res) => {
  if (req.params.group === 'suwongreenparty'){
    let i = receipts.findIndex(item => item.id === +req.params.id);
    receipts[i] = req.body;
  }
  else{
    let i = receipts2.findIndex(item => item.id === +req.params.id);
    receipts2[i] = req.body;
  }
  res.send();
}
exports.create = (req, res) => {
  let newHero = req.body;
  if (req.params.group === 'suwongreenparty'){
    newHero['id'] = receiptID++;
    receipts.push(newHero);
  }
  else{
    newHero['id'] = receiptID2++;
    receipts2.push(newHero);
  }
  res.json(newHero);
}
exports.deleteByID = (req, res) => {
  if (req.params.group === 'suwongreenparty')
    receipts = receipts.filter(h => h.id !== +req.params.id);
  else
    receipts2 = receipts2.filter(h => h.id !== +req.params.id);
  res.send();
}
