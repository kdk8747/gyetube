
var groups = [
  { id: 'suwongreenparty', title: '수원녹색당', description: '수원녹색당 그룹입니다.', createdDate: new Date(2017, 9, 25, 11, 33, 30, 0)},
  { id: 'examplelocalparty', title: '예시 - 지역정당', description: '--당 그룹입니다.', createdDate: new Date(2017, 9, 6, 11, 33, 30, 0)}
];
exports.getAll = (req, res) => {
  res.json(groups);
}
exports.getByID = (req, res) => {
  res.json(groups.find(item => item.id === +req.params.id));
}
exports.updateByID = (req, res) => {
  let i = groups.findIndex(item => item.id === +req.params.id);
  groups[i] = req.body;
  res.send();
}
exports.create = (req, res) => {
  let newGroup = req.body;

  let found = groups.find(item => item.id === newGroup.id);
  if (found != undefined){
    res.writeHead(412, {'Content-Type': 'application/json'})
    res.send();
  }
  groups.push(newGroup);
  res.json(newGroup);
}
exports.deleteByID = (req, res) => {
  groups = groups.filter(h => h.id !== +req.params.id);
  res.send();
}
