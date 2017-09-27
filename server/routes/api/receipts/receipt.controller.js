
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

var receipts2 = [
  { id: 1, modifiedDate: new Date(2016, 5, 24, 11, 33, 30, 0), paymentDate: new Date(2016, 5, 24, 11, 33, 30, 0), memo: '5월 당비입금', difference: +3000000, imageUrl: 'dummy', parentActivity: 1 },
  { id: 2, modifiedDate: new Date(2016, 5, 28, 11, 33, 30, 0), paymentDate: new Date(2016, 5, 28, 11, 33, 30, 0), memo: 'dummy1', difference: -20000, imageUrl: 'dummy', parentActivity: 2 },
  { id: 3, modifiedDate: new Date(2016, 6, 24, 11, 33, 30, 0), paymentDate: new Date(2016, 6, 24, 11, 33, 30, 0), memo: 'dummy1', difference: -150000, imageUrl: 'dummy', parentActivity: 3 },
  { id: 4, modifiedDate: new Date(2016, 6, 27, 11, 33, 30, 0), paymentDate: new Date(2016, 6, 27, 11, 33, 30, 0), memo: '6월 당비입금', difference: +360000, imageUrl: 'dummy', parentActivity: 4 },
  { id: 5, modifiedDate: new Date(2016, 7, 24, 11, 33, 30, 0), paymentDate: new Date(2016, 7, 24, 11, 33, 30, 0), memo: 'dummy1', difference: -7500, imageUrl: 'dummy', parentActivity: 5 },
  { id: 6, modifiedDate: new Date(2016, 7, 29, 11, 33, 30, 0), paymentDate: new Date(2016, 7, 29, 11, 33, 30, 0), memo: '7월 당비입금', difference: +360000, imageUrl: 'dummy', parentActivity: 6 },
  { id: 7, modifiedDate: new Date(2016, 8, 24, 11, 33, 30, 0), paymentDate: new Date(2016, 8, 24, 11, 33, 30, 0), memo: 'dummy1', difference: -20000, imageUrl: 'dummy', parentActivity: 7 },
  { id: 8, modifiedDate: new Date(2016, 8, 25, 11, 33, 30, 0), paymentDate: new Date(2016, 8, 25, 11, 33, 30, 0), memo: '8월 당비입금', difference: +360000, imageUrl: 'dummy', parentActivity: 8 },
  { id: 9, modifiedDate: new Date(2016, 9, 24, 11, 33, 30, 0), paymentDate: new Date(2016, 9, 24, 11, 33, 30, 0), memo: 'dummy1', difference: -20000, imageUrl: 'dummy', parentActivity: 9 },
  { id: 10, modifiedDate: new Date(2016, 9, 24, 11, 33, 30, 0), paymentDate: new Date(2016, 9, 24, 11, 33, 30, 0), memo: '9월 당비입금', difference: +360000, imageUrl: 'dummy', parentActivity: 10 },
  { id: 11, modifiedDate: new Date(2016, 10, 24, 11, 33, 30, 0), paymentDate: new Date(2016, 10, 24, 11, 33, 30, 0), memo: '10월 당비입금', difference: +360000, imageUrl: 'dummy', parentActivity: 10 }
];
var receiptID2 = 12;

exports.getAll = (req, res) => {
  if (req.params.group === 'suwongreenparty')
    res.json(receipts);
  else
    res.json(receipts2);
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
