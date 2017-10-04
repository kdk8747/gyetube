
var activities = [
  { id: 1, creator: '1', participants: ['1','2','3','4','5'], elapsedTime: 2, content: 'dummy content', modifiedDate: new Date(2016, 5, 24, 11, 33, 30, 0), activityDate: new Date(2016, 5, 24, 11, 33, 30, 0), title: 'hahaha', totalDifference: +3000000, parentDecision: 1, childReceipts: [1] },
  { id: 2, creator: '1', participants: ['1','2','3','4','5'], elapsedTime: 2, content: 'dummy content', modifiedDate: new Date(2016, 6, 2, 11, 33, 30, 0), activityDate: new Date(2016, 6, 2, 11, 33, 30, 0), title: 'hohoho',   totalDifference: -20000,  parentDecision: 2, childReceipts: [2] },
  { id: 3, creator: '1', participants: ['1','2','3','4','5'], elapsedTime: 2, content: 'dummy content', modifiedDate: new Date(2016, 6, 24, 11, 33, 30, 0), activityDate: new Date(2016, 6, 24, 11, 33, 30, 0), title: 'huhoho', totalDifference: -150000, parentDecision: 3, childReceipts: [3] },
  { id: 4, creator: '1', participants: ['1','2','3','4','5'], elapsedTime: 2, content: 'dummy content', modifiedDate: new Date(2016, 7, 4, 11, 33, 30, 0), activityDate: new Date(2016, 7, 4, 11, 33, 30, 0), title: 'hohuho',   totalDifference: +360000, parentDecision: 4, childReceipts: [4] },
  { id: 5, creator: '1', participants: ['1','2','3','4','5'], elapsedTime: 2, content: 'dummy content', modifiedDate: new Date(2016, 7, 24, 11, 33, 30, 0), activityDate: new Date(2016, 7, 24, 11, 33, 30, 0), title: 'hohohu', totalDifference: -7500,   parentDecision: 4, childReceipts: [5] },
  { id: 6, creator: '1', participants: ['1','2','3','4','5'], elapsedTime: 2, content: 'dummy content', modifiedDate: new Date(2016, 8, 2, 11, 33, 30, 0), activityDate: new Date(2016, 8, 2, 11, 33, 30, 0), title: 'huhuhu',   totalDifference: +360000, parentDecision: 1, childReceipts: [6] },
  { id: 7, creator: '1', participants: ['1','2','3','4','5'], elapsedTime: 2, content: 'dummy content', modifiedDate: new Date(2016, 8, 24, 11, 33, 30, 0), activityDate: new Date(2016, 8, 24, 11, 33, 30, 0), title: 'hohuha', totalDifference: -20000,  parentDecision: 5, childReceipts: [7] },
  { id: 8, creator: '1', participants: ['1','2','3','4','5'], elapsedTime: 2, content: 'dummy content', modifiedDate: new Date(2016, 9, 4, 11, 33, 30, 0), activityDate: new Date(2016, 9, 4, 11, 33, 30, 0), title: 'hohoha',   totalDifference: +360000, parentDecision: 2, childReceipts: [8] },
  { id: 9, creator: '1', participants: ['1','2','3','4','5'], elapsedTime: 2, content: 'dummy content', modifiedDate: new Date(2016, 9, 24, 11, 33, 30, 0), activityDate: new Date(2016, 9, 24, 11, 33, 30, 0), title: 'hahoho', totalDifference: -20000,  parentDecision: 5, childReceipts: [9] },
  { id: 10, creator: '1', participants: ['1','2','3','4','5'], elapsedTime: 2, content: 'dummy content', modifiedDate: new Date(2016, 10, 24, 11, 33, 30, 0), activityDate: new Date(2016, 10, 24, 11, 33, 30, 0), title: 'hahuhu', totalDifference: +720000, parentDecision: 1, childReceipts: [10, 11] }
];
var activityID = 11;

var activities2 = [
  { id: 1, creator: '1', participants: ['1','2','3','4','5'], elapsedTime: 2, content: 'dummy content', modifiedDate: new Date(2016, 5, 24, 11, 33, 30, 0), activityDate: new Date(2016, 5, 24, 11, 33, 30, 0), title: '5월 정기회의', totalDifference: +3000000, parentDecision: 1, childReceipts: [1] },
  { id: 2, creator: '1', participants: ['1','2','3','4','5'], elapsedTime: 2, content: 'dummy content', modifiedDate: new Date(2016, 6, 2, 11, 33, 30, 0), activityDate: new Date(2016, 6, 2, 11, 33, 30, 0), title: 'hohoho',        totalDifference: -20000, parentDecision: 2, childReceipts: [2] },
  { id: 3, creator: '1', participants: ['1','2','3','4','5'], elapsedTime: 2, content: 'dummy content', modifiedDate: new Date(2016, 6, 24, 11, 33, 30, 0), activityDate: new Date(2016, 6, 24, 11, 33, 30, 0), title: '6월 정기회의', totalDifference: -150000, parentDecision: 3, childReceipts: [3] },
  { id: 4, creator: '1', participants: ['1','2','3','4','5'], elapsedTime: 2, content: 'dummy content', modifiedDate: new Date(2016, 7, 4, 11, 33, 30, 0), activityDate: new Date(2016, 7, 4, 11, 33, 30, 0), title: 'hohuho',        totalDifference: +360000, parentDecision: 4, childReceipts: [4] },
  { id: 5, creator: '1', participants: ['1','2','3','4','5'], elapsedTime: 2, content: 'dummy content', modifiedDate: new Date(2016, 7, 24, 11, 33, 30, 0), activityDate: new Date(2016, 7, 24, 11, 33, 30, 0), title: '7월 정기회의', totalDifference: -7500, parentDecision: 4, childReceipts: [5] },
  { id: 6, creator: '1', participants: ['1','2','3','4','5'], elapsedTime: 2, content: 'dummy content', modifiedDate: new Date(2016, 8, 2, 11, 33, 30, 0), activityDate: new Date(2016, 8, 2, 11, 33, 30, 0), title: 'huhuhu',        totalDifference: +360000, parentDecision: 1, childReceipts: [6] },
  { id: 7, creator: '1', participants: ['1','2','3','4','5'], elapsedTime: 2, content: 'dummy content', modifiedDate: new Date(2016, 8, 24, 11, 33, 30, 0), activityDate: new Date(2016, 8, 24, 11, 33, 30, 0), title: '8월 정기회의', totalDifference: -20000, parentDecision: 5, childReceipts: [7] },
  { id: 8, creator: '1', participants: ['1','2','3','4','5'], elapsedTime: 2, content: 'dummy content', modifiedDate: new Date(2016, 9, 4, 11, 33, 30, 0), activityDate: new Date(2016, 9, 4, 11, 33, 30, 0), title: 'hohoha',        totalDifference: +360000, parentDecision: 2, childReceipts: [8] },
  { id: 9, creator: '1', participants: ['1','2','3','4','5'], elapsedTime: 2, content: 'dummy content', modifiedDate: new Date(2016, 9, 24, 11, 33, 30, 0), activityDate: new Date(2016, 9, 24, 11, 33, 30, 0), title: '9월 정기회의', totalDifference: -20000, parentDecision: 5, childReceipts: [9] },
  { id: 10, creator: '1', participants: ['1','2','3','4','5'], elapsedTime: 2, content: 'dummy content', modifiedDate: new Date(2016, 10, 24, 11, 33, 30, 0), activityDate: new Date(2016, 10, 24, 11, 33, 30, 0), title: '10월 정기회의',totalDifference: +720000, parentDecision: 1, childReceipts: [10, 11] }
];
var activityID2 = 11;

exports.getAll = (req, res) => {
  if (req.params.group === 'suwongreenparty')
    res.json(activities);
  else
    res.json(activities2);
}
exports.getByID = (req, res) => {
  if (req.params.group === 'suwongreenparty')
    res.json(activities.find(item => item.id === +req.params.id));
  else
    res.json(activities2.find(item => item.id === +req.params.id));
}
exports.updateByID = (req, res) => {
  if (req.params.group === 'suwongreenparty'){
    let i = activities.findIndex(item => item.id === +req.params.id);
    activities[i] = req.body;
  }
  else{
    let i = activities2.findIndex(item => item.id === +req.params.id);
    activities2[i] = req.body;
  }
  res.send();
}
exports.create = (req, res) => {
  let newHero = req.body;
  if (req.params.group === 'suwongreenparty'){
    newHero['id'] = activityID++;
    activities.push(newHero);
  }
  else{
    newHero['id'] = activityID2++;
    activities2.push(newHero);
  }
  res.json(newHero);
}
exports.deleteByID = (req, res) => {
  if (req.params.group === 'suwongreenparty')
    activities = activities.filter(h => h.id !== +req.params.id);
  else
    activities2 = activities2.filter(h => h.id !== +req.params.id);
  res.send();
}
