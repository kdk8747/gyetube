
var activities = [
  {
    id: 1,
    creator: 'kk471891074',
    participants: ['yd', 'sj', 'kk471891074', 'jy', 'ty', 'jh'],
    elapsedTime: 2,
    title: '수원녹색당 임시총회',
    location: '행궁동 공존공간 1층',
    description: '수원녹색당 임시총회',
    modifiedDate: new Date("2017-10-06T11:30:00+09:00"),
    activityDate: new Date("2016-03-07T19:30:00+09:00"),
    imageUrls: [],
    documentUrls: [],
    parentDecision: 1,
    childReceipts: [],
    totalDifference: 0
  },
];
var activityID = 11;

var activities2 = [
  { id: 1, creator: '1', imageUrls: [], documentUrls: [], participants: ['1', '2', '3', '4', '5'], elapsedTime: 2, description: 'dummy content', modifiedDate: new Date(2016, 5, 24, 11, 33, 30, 0), activityDate: new Date(2016, 5, 24, 11, 33, 30, 0), title: '5월 정기회의', totalDifference: +3000000, parentDecision: 1, childReceipts: [1] },
  { id: 2, creator: '1', imageUrls: [], documentUrls: [], participants: ['1', '2', '3', '4', '5'], elapsedTime: 2, description: 'dummy content', modifiedDate: new Date(2016, 6, 2, 11, 33, 30, 0), activityDate: new Date(2016, 6, 2, 11, 33, 30, 0), title: 'hohoho', totalDifference: -20000, parentDecision: 2, childReceipts: [2] },
  { id: 3, creator: '1', imageUrls: [], documentUrls: [], participants: ['1', '2', '3', '4', '5'], elapsedTime: 2, description: 'dummy content', modifiedDate: new Date(2016, 6, 24, 11, 33, 30, 0), activityDate: new Date(2016, 6, 24, 11, 33, 30, 0), title: '6월 정기회의', totalDifference: -150000, parentDecision: 3, childReceipts: [3] },
  { id: 4, creator: '1', imageUrls: [], documentUrls: [], participants: ['1', '2', '3', '4', '5'], elapsedTime: 2, description: 'dummy content', modifiedDate: new Date(2016, 7, 4, 11, 33, 30, 0), activityDate: new Date(2016, 7, 4, 11, 33, 30, 0), title: 'hohuho', totalDifference: +360000, parentDecision: 4, childReceipts: [4] },
  { id: 5, creator: '1', imageUrls: [], documentUrls: [], participants: ['1', '2', '3', '4', '5'], elapsedTime: 2, description: 'dummy content', modifiedDate: new Date(2016, 7, 24, 11, 33, 30, 0), activityDate: new Date(2016, 7, 24, 11, 33, 30, 0), title: '7월 정기회의', totalDifference: -7500, parentDecision: 4, childReceipts: [5] },
  { id: 6, creator: '1', imageUrls: [], documentUrls: [], participants: ['1', '2', '3', '4', '5'], elapsedTime: 2, description: 'dummy content', modifiedDate: new Date(2016, 8, 2, 11, 33, 30, 0), activityDate: new Date(2016, 8, 2, 11, 33, 30, 0), title: 'huhuhu', totalDifference: +360000, parentDecision: 1, childReceipts: [6] },
  { id: 7, creator: '1', imageUrls: [], documentUrls: [], participants: ['1', '2', '3', '4', '5'], elapsedTime: 2, description: 'dummy content', modifiedDate: new Date(2016, 8, 24, 11, 33, 30, 0), activityDate: new Date(2016, 8, 24, 11, 33, 30, 0), title: '8월 정기회의', totalDifference: -20000, parentDecision: 5, childReceipts: [7] },
  { id: 8, creator: '1', imageUrls: [], documentUrls: [], participants: ['1', '2', '3', '4', '5'], elapsedTime: 2, description: 'dummy content', modifiedDate: new Date(2016, 9, 4, 11, 33, 30, 0), activityDate: new Date(2016, 9, 4, 11, 33, 30, 0), title: 'hohoha', totalDifference: +360000, parentDecision: 2, childReceipts: [8] },
  { id: 9, creator: '1', imageUrls: [], documentUrls: [], participants: ['1', '2', '3', '4', '5'], elapsedTime: 2, description: 'dummy content', modifiedDate: new Date(2016, 9, 24, 11, 33, 30, 0), activityDate: new Date(2016, 9, 24, 11, 33, 30, 0), title: '9월 정기회의', totalDifference: -20000, parentDecision: 5, childReceipts: [9] },
  { id: 10, creator: '1', imageUrls: ['http://cfile29.uf.tistory.com/image/264ED6395174B648342845','https://s3.ap-northeast-2.amazonaws.com/grassroots-groups/suwongreenparty/photos/Credit-cards.jpg','https://s3.ap-northeast-2.amazonaws.com/grassroots-groups/suwongreenparty/photos/drop-coins-in-piggy-bank_grqhnr.jpg'], documentUrls: ['https://s3.ap-northeast-2.amazonaws.com/grassroots-groups/suwongreenparty/documents/test.html'], participants: ['1', '2', '3', '4', '5'], elapsedTime: 2, description: 'dummy content', modifiedDate: new Date(2016, 10, 24, 11, 33, 30, 0), activityDate: new Date(2016, 10, 24, 11, 33, 30, 0), title: '10월 정기회의', totalDifference: +720000, parentDecision: 1, childReceipts: [10, 11] }
];
var activityID2 = 11;

exports.getAll = (req, res) => {
  if (req.params.group === 'examplelocalparty') {
    res.json(activities2);
  }
  else if (req.params.group === 'suwongreenparty') {
    if (req.decoded && req.params.group in req.decoded.permissions.groups)
      res.json(activities);
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
    res.json(activities2.find(item => item.id === +req.params.id));
  }
  else if (req.params.group === 'suwongreenparty') {
    if (req.decoded && req.params.group in req.decoded.permissions.groups)
      res.json(activities.find(item => item.id === +req.params.id));
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
    let i = activities2.findIndex(item => item.id === +req.params.id);
    activities2[i] = req.body;
    res.send();
  }
  else if (req.params.group === 'suwongreenparty') {
    if (req.params.group in req.decoded.permissions.groups) {
      let i = activities.findIndex(item => item.id === +req.params.id);
      activities[i] = req.body;
      res.send();
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
  let newActivity = req.body;
  if (req.params.group === 'examplelocalparty') {
    newActivity['id'] = activityID2++;
    newActivity['creator'] = req.decoded.id;
    activities2.push(newActivity);
    res.json(newActivity);
  }
  else if (req.params.group === 'suwongreenparty') {
    if (req.params.group in req.decoded.permissions.groups) {
      newActivity['id'] = activityID++;
      newActivity['creator'] = req.decoded.id;
      activities.push(newActivity);
      res.json(newActivity);
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

exports.deleteByID = (req, res) => {
  if (req.params.group === 'examplelocalparty') {
    activities2 = activities2.filter(h => h.id !== +req.params.id);
    res.send();
  }
  else if (req.params.group === 'suwongreenparty') {
    if (req.params.group in req.decoded.permissions.groups){
      activities = activities.filter(h => h.id !== +req.params.id);
      res.send();
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
