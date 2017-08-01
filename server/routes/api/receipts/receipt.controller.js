
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
exports.getAll = (req, res) => {
  res.json(receipts);
}
exports.getByID = (req, res) => {
  res.json(receipts.find(item => item.id === +req.params.id));
}
exports.updateByID = (req, res) => {
  let i = receipts.findIndex(item => item.id === +req.params.id);
  receipts[i] = req.body;
  res.send();
}
exports.create = (req, res) => {
  let newHero = req.body;
  newHero['id'] = receiptID++;
  receipts.push(newHero);
  res.json(newHero);
}
exports.deleteByID = (req, res) => {
  receipts = receipts.filter(h => h.id !== +req.params.id);
  res.send();
}