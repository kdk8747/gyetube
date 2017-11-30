
/*var groups = [
  {
    id: 'suwongreenparty',
    title: '수원녹색당',
    description: '수원녹색당 그룹입니다.',
    imageUrl:'http://cfile29.uf.tistory.com/image/264ED6395174B648342845',
    createdDate: new Date("2017-10-06T19:30:00+09:00"),
    members: ['kk471891074', 'fb1461221603961141', 'nv9aab5d64e21c0330c235916dcdf03c78fc00d92debf6ae63a6cb2076a1f66da8', 'yd', 'hk', 'sj', 'jy', 'ty', 'jh'],
    roles: [
      {id: 'anyone', name:'아무나', proceedings:'____', decisions:'____', activities:'_r__', receipts:'_r__'},
      {id: 'member', name:'당원', proceedings:'_ru_', decisions:'_ru_', activities:'crud', receipts:'crud'},
      {id: 'commitee', name:'운영위원', proceedings:'cru_', decisions:'_ru_', activities:'crud', receipts:'crud'}
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
      {id: 'commitee', name:'운영위원', proceedings:'cru_', decisions:'_ru_', activities:'crud', receipts:'crud'}
    ]
  }
];*/
const models = require('../../../models');
const debug = require('debug')('server');

exports.getAll = (req, res) => {
  models.sequelize.transaction(t => {
    return models.group.findAll({
      attributes: ['group_id','url_segment','title','description','image_url','created_datetime']
    }, {transaction: t});
  }).then((result) => {
    res.json(result.map(row => {
      return {
        id: row.dataValues.url_segment,
        title: row.dataValues.title,
        description: row.dataValues.description,
        imageUrl: row.dataValues.image_url,
        createdDate: row.dataValues.created_datetime
      };
    }));
  }).catch((reason => {
    res.status(400).json({
      success: false,
      message: reason
    });
  }));
  //res.json(groups);
  /*
  models.group.findAll().then((result) => {
    debug('@@@@@' + JSON.stringify(result[0].dataValues));
    debug('@@@@@' + JSON.stringify(result[1].dataValues));
    res.json(result.map(row => row.dataValues));
  }).catch((reason => {
    res.status(400).json({
      success: false,
      message: reason
    });
  }));*/
}

exports.getByID = (req, res) => {
  models.sequelize.transaction(t => {
    return models.group.findOne({
      attributes: ['group_id','url_segment','title','description','image_url','created_datetime'],
      where: {url_segment: req.params.group}
    }, {transaction: t});
  }).then((result) => {
    res.json({
      id: result.url_segment,
      title: result.title,
      description: result.description,
      imageUrl: result.image_url,
      createdDate: result.created_datetime
    });
  }).catch((reason => {
    res.status(400).json({
      success: false,
      message: reason
    });
  }));
}

exports.getRoles = (req, res) => {
  let found = groups.find(item => item.id === req.params.group);
  if (found == undefined){
    res.status(404).json({
      success: false,
      message: 'groupId: not found'
    });
  }
  res.json(found.roles);
}
exports.getRole = (req, res) => {
  let group = groups.find(item => item.id === req.params.group);
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
  let i = groups.findIndex(item => item.id === req.params.group);
  groups[i] = req.body;
  res.send();
}
exports.create = (req, res) => {
  let newGroup = req.body;

  let found = groups.find(item => item.id === newGroup.group);
  if (found != undefined){
    res.writeHead(412, {'Content-Type': 'application/json'})
    res.send();
  }
  groups.push(newGroup);
  res.json(newGroup);
}
exports.deleteByID = (req, res) => {
  groups = groups.filter(h => h.id !== req.params.group);
  res.send();
}
