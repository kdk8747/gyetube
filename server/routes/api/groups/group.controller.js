
var groups = [
  {
    id: 'suwongreenparty',
    title: '수원녹색당',
    description: '수원녹색당 그룹입니다.',
    imageUrl:'http://cfile29.uf.tistory.com/image/264ED6395174B648342845',
    createdDate: new Date("2017-10-06T19:30:00+09:00"),
    members: ['471891074', '2', '3', '4', '5'],
    roles: [
      {id: 'anyone', name:'아무나', proceedings:'____', decisions:'____', activities:'_r__', receipts:'_r__'},
      {id: 'member', name:'당원', proceedings:'_ru_', decisions:'_ru_', activities:'crud', receipts:'crud'},
      {id: 'commitee', name:'운영위원', proceedings:'cru_', decisions:'cru_', activities:'crud', receipts:'crud'}
    ]
  },
  {
    id: 'examplelocalparty',
    title: '예시 - 지역정당',
    description: '--당 그룹입니다.',
    imageUrl:'',
    createdDate: new Date("2017-10-06T19:30:00+09:00"),
    members: ['1', '2', '3', '4', '5'],
    roles: [
      {id: 'anyone', name:'아무나', proceedings:'_r__', decisions:'_r__', activities:'_r__', receipts:'_r__'},
      {id: 'member', name:'구성원', proceedings:'_ru_', decisions:'_ru_', activities:'crud', receipts:'crud'},
      {id: 'commitee', name:'운영위원', proceedings:'cru_', decisions:'cru_', activities:'crud', receipts:'crud'}
    ]
  }
];

exports.getAll = (req, res) => {
  res.json(groups);
}
exports.getByID = (req, res) => {
  res.json(groups.find(item => item.id === req.params.id));
}
exports.getRoles = (req, res) => {
  let found = groups.find(item => item.id === req.params.id);
  if (found == undefined){
    res.status(404).json({
      success: false,
      message: 'groupId: not found'
    });
  }
  res.json(found.roles);
}
exports.getRole = (req, res) => {
  let group = groups.find(item => item.id === req.params.id);
  if (group == undefined){
    res.status(404).json({
      success: false,
      message: 'groupId: not found'
    });
  }
  let role = group.roles.find(item => item.id === req.params.role);
  if (role != undefined){
    res.json(role);
  }
  else {
    res.status(404).json({
      success: false,
      message: 'role: not found'
    });
  }
}
exports.updateByID = (req, res) => {
  let i = groups.findIndex(item => item.id === req.params.id);
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
  groups = groups.filter(h => h.id !== req.params.id);
  res.send();
}
