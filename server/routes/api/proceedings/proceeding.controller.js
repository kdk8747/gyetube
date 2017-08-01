var proceedings = [
  { id: 1, prevId: 0, state: 0, createdDate: new Date(2016, 5, 24, 11, 33, 30, 0), meetingDate: new Date(2016, 5, 24, 11, 33, 30, 0), title: 'dummy1', content: 'dummy1', childPolicies: [1] },
  { id: 2, prevId: 0, state: 0, createdDate: new Date(2016, 6, 24, 11, 33, 30, 0), meetingDate: new Date(2016, 6, 24, 11, 33, 30, 0), title: 'dummy2', content: 'dummy2', childPolicies: [2] },
  { id: 3, prevId: 0, state: 0, createdDate: new Date(2016, 7, 24, 11, 33, 30, 0), meetingDate: new Date(2016, 7, 24, 11, 33, 30, 0), title: 'dummy3', content: 'dummy3', childPolicies: [3] },
  { id: 4, prevId: 0, state: 0, createdDate: new Date(2016, 8, 24, 11, 33, 30, 0), meetingDate: new Date(2016, 8, 24, 11, 33, 30, 0), title: 'dummy4', content: 'dummy4', childPolicies: [4] },
  { id: 5, prevId: 0, state: 0, createdDate: new Date(2016, 9, 24, 11, 33, 30, 0), meetingDate: new Date(2016, 9, 24, 11, 33, 30, 0), title: 'dummy5', content: 'dummy5', childPolicies: [5] }
];
var proceedingID = 6;
exports.getAll = (req, res) => {
  res.json(proceedings);
}
exports.getByID =  (req, res) => {
  res.json(proceedings.find(item => item.id === +req.params.id));
}
exports.updateByID = (req, res) => {
  let i = proceedings.findIndex(item => item.id === +req.params.id);
  proceedings[i] = req.body;
  res.send();
}
exports.create = (req, res) => {
  let newProceeding = req.body;
  newProceeding['id'] = proceedingID++;
  proceedings.push(newProceeding);
  res.json(newProceeding);
}
exports.deleteByID = (req, res) => {
  proceedings = proceedings.filter(h => h.id !== +req.params.id);
  res.send();
}