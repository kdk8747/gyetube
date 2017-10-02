var proceedings = [
  { id: 1, prevId: 0, state: 0, createdDate: new Date(2016, 5, 24, 11, 33, 30, 0), meetingDate: new Date(2016, 5, 24, 11, 33, 30, 0), title: 'dummy1', attendees: ['1','2','3','4','5'], content: 'dummy1', childDecisions: [1] },
  { id: 2, prevId: 0, state: 0, createdDate: new Date(2016, 6, 24, 11, 33, 30, 0), meetingDate: new Date(2016, 6, 24, 11, 33, 30, 0), title: 'dummy2', attendees: ['1','2','3','4','5'], content: 'dummy2', childDecisions: [2] },
  { id: 3, prevId: 0, state: 0, createdDate: new Date(2016, 7, 24, 11, 33, 30, 0), meetingDate: new Date(2016, 7, 24, 11, 33, 30, 0), title: 'dummy3', attendees: ['1','2','3','4','5'], content: 'dummy3', childDecisions: [3] },
  { id: 4, prevId: 0, state: 0, createdDate: new Date(2016, 8, 24, 11, 33, 30, 0), meetingDate: new Date(2016, 8, 24, 11, 33, 30, 0), title: 'dummy4', attendees: ['1','2','3','4','5'], content: 'dummy4', childDecisions: [4] },
  { id: 5, prevId: 0, state: 0, createdDate: new Date(2016, 9, 24, 11, 33, 30, 0), meetingDate: new Date(2016, 9, 24, 11, 33, 30, 0), title: 'dummy5', attendees: ['1','2','3','4','5'], content: 'dummy5', childDecisions: [5] }
];
var proceedingID = 6;

var proceedings2 = [
  { id: 1, prevId: 0, state: 0, createdDate: new Date(2016, 5, 24, 11, 33, 30, 0), meetingDate: new Date(2016, 5, 24, 11, 33, 30, 0), title: '5월 정기 회의', attendees: ['1','2','3','4','5'], content: 'blah blah', childDecisions: [1] },
  { id: 2, prevId: 0, state: 0, createdDate: new Date(2016, 6, 24, 11, 33, 30, 0), meetingDate: new Date(2016, 6, 24, 11, 33, 30, 0), title: '6월 정기 회의', attendees: ['1','2','3','4','5'], content: 'blah blah', childDecisions: [2] },
  { id: 3, prevId: 0, state: 0, createdDate: new Date(2016, 7, 24, 11, 33, 30, 0), meetingDate: new Date(2016, 7, 24, 11, 33, 30, 0), title: '7월 정기 회의', attendees: ['1','2','3','4','5'], content: 'blah blah', childDecisions: [3] },
  { id: 4, prevId: 0, state: 0, createdDate: new Date(2016, 8, 24, 11, 33, 30, 0), meetingDate: new Date(2016, 8, 24, 11, 33, 30, 0), title: '8월 정기 회의', attendees: ['1','2','3','4','5'], content: 'blah blah', childDecisions: [4] },
  { id: 5, prevId: 0, state: 0, createdDate: new Date(2016, 9, 24, 11, 33, 30, 0), meetingDate: new Date(2016, 9, 24, 11, 33, 30, 0), title: '9월 정기 회의', attendees: ['1','2','3','4','5'], content: 'blah blah', childDecisions: [5] }
];
var proceedingID2 = 6;

exports.getAll = (req, res) => {
  if (req.params.group === 'suwongreenparty')
    res.json(proceedings);
  else
    res.json(proceedings2);
}
exports.getByID =  (req, res) => {
  if (req.params.group === 'suwongreenparty')
    res.json(proceedings.find(item => item.id === +req.params.id));
  else
    res.json(proceedings2.find(item => item.id === +req.params.id));
}
exports.updateByID = (req, res) => {
  if (req.params.group === 'suwongreenparty'){
    let i = proceedings.findIndex(item => item.id === +req.params.id);
    proceedings[i] = req.body;
  }
  else {
    let i = proceedings2.findIndex(item => item.id === +req.params.id);
    proceedings2[i] = req.body;
  }
  res.send();
}
exports.create = (req, res) => {
  let newProceeding = req.body;
  if (req.params.group === 'suwongreenparty'){
    newProceeding['id'] = proceedingID++;
    proceedings.push(newProceeding);
  }
  else{
    newProceeding['id'] = proceedingID2++;
    proceedings2.push(newProceeding);
  }
  res.json(newProceeding);
}
exports.deleteByID = (req, res) => {
  if (req.params.group === 'suwongreenparty')
    proceedings = proceedings.filter(h => h.id !== +req.params.id);
  else
    proceedings2 = proceedings2.filter(h => h.id !== +req.params.id);
  res.send();
}
