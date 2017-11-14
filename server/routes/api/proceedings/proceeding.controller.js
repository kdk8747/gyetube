var proceedings = [
  {
    id: 1, prevId: 0,
    state: 0,
    createdDate: new Date("2017-10-06T11:30:00+09:00"),
    meetingDate: new Date("2016-03-07T19:30:00+09:00"),
    title: '수원녹색당 임시총회',
    attendees: ['yd', 'sj', 'kk471891074', 'jy', 'ty', 'jh'],
    reviewers: ['yd', 'sj', 'kk471891074', 'jy', 'ty', 'jh'],
    description:
    '-',
    childDecisions: [2, 3, 4]
  }
];
var proceedingID = 6;

var proceedings2 = [
  { id: 1, prevId: 0, nextId: 0, state: 0, createdDate: new Date(2016, 5, 24, 11, 33, 30, 0), meetingDate: new Date(2016, 5, 24, 11, 33, 30, 0), title: '5월 정기 회의', attendees: ['1', '2', '3', '4', '5'], reviewers: ['1', '2', '3', '4', '5'], description: 'blah blah', childDecisions: [1] },
  { id: 2, prevId: 0, nextId: 0, state: 0, createdDate: new Date(2016, 6, 24, 11, 33, 30, 0), meetingDate: new Date(2016, 6, 24, 11, 33, 30, 0), title: '6월 정기 회의', attendees: ['1', '2', '3', '4', '5'], reviewers: ['1', '2', '3', '4', '5'], description: 'blah blah', childDecisions: [2] },
  { id: 3, prevId: 0, nextId: 0, state: 0, createdDate: new Date(2016, 7, 24, 11, 33, 30, 0), meetingDate: new Date(2016, 7, 24, 11, 33, 30, 0), title: '7월 정기 회의', attendees: ['1', '2', '3', '4', '5'], reviewers: ['1', '2', '3', '4', '5'], description: 'blah blah', childDecisions: [3] },
  { id: 4, prevId: 0, nextId: 0, state: 0, createdDate: new Date(2016, 8, 24, 11, 33, 30, 0), meetingDate: new Date(2016, 8, 24, 11, 33, 30, 0), title: '8월 정기 회의', attendees: ['1', '2', '3', '4', '5'], reviewers: ['1', '2', '3', '4', '5'], description: 'blah blah', childDecisions: [4] },
  { id: 5, prevId: 0, nextId: 0, state: 0, createdDate: new Date(2016, 9, 24, 11, 33, 30, 0), meetingDate: new Date(2016, 9, 24, 11, 33, 30, 0), title: '9월 정기 회의', attendees: ['1', '2', '3', '4', '5'], reviewers: ['1', '2', '3', '4', '5'], description: 'blah blah', childDecisions: [5] }
];
var proceedingID2 = 6;

exports.getAll = (req, res) => {
  if (req.params.group === 'examplelocalparty') {
    res.json(proceedings2);
  }
  else if (req.params.group === 'suwongreenparty') {
    if (req.decoded && req.params.group in req.decoded.permissions.groups)
      res.json(proceedings);
    else
      res.status(401).json({
        success: false,
        message: 'not logged in'
      });
  }
  else
    res.status(404).json({
      success: false,
      message: 'groupId: not found'
    });
}

exports.getByID = (req, res) => {
  if (req.params.group === 'examplelocalparty') {
    res.json(proceedings2.find(item => item.id === +req.params.id));
  }
  else if (req.params.group === 'suwongreenparty') {
    if (req.decoded && req.params.group in req.decoded.permissions.groups)
      res.json(proceedings.find(item => item.id === +req.params.id));
    else
      res.status(401).json({
        success: false,
        message: 'not logged in'
      });
  }
  else
    res.status(404).json({
      success: false,
      message: 'groupId: not found'
    });
}

exports.updateByID = (req, res) => {
  if (req.params.group === 'examplelocalparty') {
    res.status(401).json({
      success: false,
      message: 'not allowed'
    });
  }
  else if (req.params.group === 'suwongreenparty') {
    if (req.params.group in req.decoded.permissions.groups) {
      let i = proceedings.findIndex(item => item.id === +req.params.id);
      if (i != -1){
        if (proceedings[i].attendees.find(item => item === req.decoded.id)
          && !proceedings[i].reviewers.find(item => item === req.decoded.id)) {
          proceedings[i].reviewers.push(req.decoded.id);
        }

        if (proceedings[i].attendees.length == proceedings[i].reviewers.length)
          proceedings[i].state = 0; // NEW_ONE
      }
      res.json(proceedings[i]);
    }
    else
      res.status(401).json({
        success: false,
        message: 'not logged in'
      });
  }
  else
    res.status(404).json({
      success: false,
      message: 'groupId: not found'
    });
}

exports.create = (req, res) => {
  if (req.params.group === 'examplelocalparty') {
    res.status(401).json({
      success: false,
      message: 'not allowed'
    });
  }
  else if (req.params.group === 'suwongreenparty') {
    if (req.params.group in req.decoded.permissions.groups) {
      let newProceeding = req.body;
      newProceeding.id = proceedingID++;
      if(+newProceeding.prevId > 0)
        proceedings.find(item => item.id === +newProceeding.prevId).nextId = newProceeding.id;

      newProceeding.childDecisions = []; // TODO

      proceedings.push(newProceeding);
      res.json(newProceeding);
    }
    else
      res.status(401).json({
        success: false,
        message: 'not logged in'
      });
  }
  else
    res.status(404).json({
      success: false,
      message: 'groupId: not found'
    });
}
