
var policies = [
  { id: 1, prevId: 0, state: 0, createdDate: new Date(2016, 5, 24, 11, 33, 30, 0), expiryDate: new Date(2018, 5, 24, 11, 33, 30, 0), parentProceeding: 1, childActivities: [1, 6, 10], content: '소모임 활성화 방안 - 녹색평론 읽기모임' },
  { id: 2, prevId: 0, state: 0, createdDate: new Date(2016, 6, 24, 11, 33, 30, 0), expiryDate: new Date(2018, 5, 24, 11, 33, 30, 0), parentProceeding: 2, childActivities: [2, 8], content: '소식지 발송 활동' },
  { id: 3, prevId: 0, state: 0, createdDate: new Date(2016, 7, 24, 11, 33, 30, 0), expiryDate: new Date(2018, 5, 24, 11, 33, 30, 0), parentProceeding: 3, childActivities: [3], content: '한달에 한번 정보공개청구' },
  { id: 4, prevId: 0, state: 0, createdDate: new Date(2016, 8, 24, 11, 33, 30, 0), expiryDate: new Date(2018, 5, 24, 11, 33, 30, 0), parentProceeding: 4, childActivities: [4, 5], content: 'dummy4' },
  { id: 5, prevId: 0, state: 0, createdDate: new Date(2016, 9, 24, 11, 33, 30, 0), expiryDate: new Date(2018, 5, 24, 11, 33, 30, 0), parentProceeding: 5, childActivities: [7, 9], content: 'dummy5' }
];
var policyID = 6;
exports.getAll = (req, res) => {
  res.json(policies);
}
exports.getByID = (req, res) => {
  res.json(policies.find(item => item.id === +req.params.id));
}
exports.updateByID = (req, res) => {
  let i = policies.findIndex(item => item.id === +req.params.id);
  policies[i] = req.body;
  res.send();
}
exports.create = (req, res) => {
  let newPolicy = req.body;
  newPolicy['id'] = policyID++;
  policies.push(newPolicy);
  res.json(newPolicy);
}
exports.deleteByID = (req, res) => {
  policies = policies.filter(h => h.id !== +req.params.id);
  res.send();
}