const models = require('../../../models');
const debug = require('debug')('server');

exports.getAll = (req, res) => {
  models.member.findAll({
    attributes: ['member_id', 'decision_id', 'prev_id', 'next_id', 'state', 'creator_id', 'modified_datetime', 'image_url', 'name'],
    where: { group_id: req.params.group_id }
  }).then((result) => {
    res.json(result.map(row => {
      return {
        id: row.dataValues.member_id,
        prevId: row.dataValues.prev_id,
        nextId: row.dataValues.next_id,
        state: row.dataValues.state,
        creator: row.dataValues.creator_id,
        modifiedDate: row.dataValues.modified_datetime,
        imageUrl: row.dataValues.image_url,
        name: row.dataValues.name,
        parentDecision: row.dataValues.decision_id
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
  models.member.findOne({
    attributes: ['member_id', 'decision_id', 'prev_id', 'next_id', 'state', 'creator_id', 'modified_datetime', 'image_url', 'name'],
    where: { group_id: req.params.group_id, member_id: +req.params.member_id }
  }).then((result) => {
    res.json({
      id: result.member_id,
      prevId: result.prev_id,
      nextId: result.next_id,
      state: result.state,
      creator: result.creator_id,
      modifiedDate: result.modified_datetime,
      imageUrl: result.image_url,
      name: result.name,
      parentDecision: result.decision_id
    });
  }).catch((reason => {
    res.status(400).json({
      success: false,
      message: reason
    });
  }));
}

exports.updateByID = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'groupId: not found'
  });
}
