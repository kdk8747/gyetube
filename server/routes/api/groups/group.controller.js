const models = require('../../../models');
const debug = require('debug')('server');

exports.getAll = (req, res) => {
  models.group.findAll({
    attributes: ['group_id', 'url_segment', 'title', 'description', 'image_url', 'created_datetime']
  }).then((result) => {
    res.json(result.map(row => {
      return {
        id: row.dataValues.group_id,
        urlSegment: row.dataValues.url_segment,
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
}

exports.getByID = (req, res) => {
  models.group.findOne({
    attributes: ['group_id', 'url_segment', 'title', 'description', 'image_url', 'created_datetime'],
    where: { group_id: req.params.group_id }
  }).then((result) => {
    res.json({
      id: result.group_id,
      urlSegment: result.url_segment,
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

exports.getID = (req, res) => {
  models.url_segment.findOne({
    attributes: ['group_id'],
    where: { url_segment: req.params.url_segment }
  }).then((result) => {
    res.json(result);
  }).catch((reason => {
    res.status(400).json({
      success: false,
      message: reason
    });
  }));
}

exports.updateByID = (req, res) => {
  let i = groups.findIndex(item => item.id === req.params.group);
  groups[i] = req.body;
  res.send();
}

exports.create = (req, res) => {
  let newGroup = req.body;

  let found = groups.find(item => item.id === newGroup.group);
  if (found != undefined) {
    res.writeHead(412, { 'Content-Type': 'application/json' })
    res.send();
  }
  groups.push(newGroup);
  res.json(newGroup);
}
exports.deleteByID = (req, res) => {
  groups = groups.filter(h => h.id !== req.params.group);
  res.send();
}
