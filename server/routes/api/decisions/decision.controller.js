
var decisions = [
  { id: 1, prevId: 0, state: 0, content: 'dummy content', abstainers:['1'], accepters:['2','3'], rejecters:['4','5'], createdDate: new Date(2016, 5, 24, 11, 33, 30, 0), expiryDate: new Date(2018, 5, 24, 11, 33, 30, 0), parentProceeding: 1, childActivities: [1, 6, 10], title: '소모임 활성화 방안 - 녹색평론 읽기모임' },
  { id: 2, prevId: 0, state: 0, content: 'dummy content', abstainers:['1'], accepters:['2','3'], rejecters:['4','5'], createdDate: new Date(2016, 6, 24, 11, 33, 30, 0), expiryDate: new Date(2018, 5, 24, 11, 33, 30, 0), parentProceeding: 2, childActivities: [2, 8], title: '소식지 발송 활동' },
  { id: 3, prevId: 0, state: 0, content: 'dummy content', abstainers:['1'], accepters:['2','3'], rejecters:['4','5'], createdDate: new Date(2016, 7, 24, 11, 33, 30, 0), expiryDate: new Date(2018, 5, 24, 11, 33, 30, 0), parentProceeding: 3, childActivities: [3], title: '한달에 한번 정보공개청구' },
  { id: 4, prevId: 0, state: 0, content: 'dummy content', abstainers:['1'], accepters:['2','3'], rejecters:['4','5'], createdDate: new Date(2016, 8, 24, 11, 33, 30, 0), expiryDate: new Date(2018, 5, 24, 11, 33, 30, 0), parentProceeding: 4, childActivities: [4, 5], title: 'dummy4' },
  { id: 5, prevId: 0, state: 0, content: 'dummy content', abstainers:['1'], accepters:['2','3'], rejecters:['4','5'], createdDate: new Date(2016, 9, 24, 11, 33, 30, 0), expiryDate: new Date(2018, 5, 24, 11, 33, 30, 0), parentProceeding: 5, childActivities: [7, 9], title: 'dummy5' }
];
var decisionID = 6;

var decisions2 = [
  { id: 1, prevId: 0, state: 0, content: 'dummy content', abstainers:['1'], accepters:['2','3'], rejecters:['4','5'], createdDate: new Date(2016, 5, 24, 11, 33, 30, 0), expiryDate: new Date(2018, 5, 24, 11, 33, 30, 0), parentProceeding: 1, childActivities: [1, 6, 10], title: '설문조사' },
  { id: 2, prevId: 0, state: 0, content: 'dummy content', abstainers:[], accepters:['1','2','3'], rejecters:['4','5'], createdDate: new Date(2016, 6, 24, 11, 33, 30, 0), expiryDate: new Date(2018, 5, 24, 11, 33, 30, 0), parentProceeding: 2, childActivities: [2, 8], title: '홍보 - 현수막' },
  { id: 3, prevId: 0, state: 0, content: 'dummy content', abstainers:[], accepters:['1','2','3','4','5'], rejecters:[], createdDate: new Date(2016, 7, 24, 11, 33, 30, 0), expiryDate: new Date(2018, 5, 24, 11, 33, 30, 0), parentProceeding: 3, childActivities: [3], title: '한달에 한번 회의' },
  { id: 4, prevId: 0, state: 0, content: 'dummy content', abstainers:['1'], accepters:['2','3'], rejecters:['4','5'], createdDate: new Date(2016, 8, 24, 11, 33, 30, 0), expiryDate: new Date(2018, 5, 24, 11, 33, 30, 0), parentProceeding: 4, childActivities: [4, 5], title: '지역구 별 통계 조사' },
  { id: 5, prevId: 0, state: 0, content: 'dummy content', abstainers:['1'], accepters:['2','3'], rejecters:['4','5'], createdDate: new Date(2016, 9, 24, 11, 33, 30, 0), expiryDate: new Date(2018, 5, 24, 11, 33, 30, 0), parentProceeding: 5, childActivities: [7, 9], title: '시민사회 연대' }
];
var decisionID2 = 6;

exports.getAll = (req, res) => {
  if (req.params.group === 'suwongreenparty')
    res.json(decisions);
  else
    res.json(decisions2);
}
exports.getByID = (req, res) => {
  if (req.params.group === 'suwongreenparty')
    res.json(decisions.find(item => item.id === +req.params.id));
  else
    res.json(decisions2.find(item => item.id === +req.params.id));
}
exports.updateByID = (req, res) => {
  if (req.params.group === 'suwongreenparty') {
    let i = decisions.findIndex(item => item.id === +req.params.id);
    decisions[i] = req.body;
  }
  else {
    let i = decisions2.findIndex(item => item.id === +req.params.id);
    decisions2[i] = req.body;
  }
  res.send();
}
exports.create = (req, res) => {
  let newDecision = req.body;
  if (req.params.group === 'suwongreenparty') {
    newDecision['id'] = decisionID++;
    decisions.push(newDecision);
  }
  else {
    newDecision['id'] = decisionID2++;
    decisions2.push(newDecision);
  }
  res.json(newDecision);
}
exports.deleteByID = (req, res) => {
  if (req.params.group === 'suwongreenparty')
    decisions = decisions.filter(h => h.id !== +req.params.id);
  else
    decisions2 = decisions2.filter(h => h.id !== +req.params.id);
  res.send();
}
