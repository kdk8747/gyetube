const models = require('../../../models');
const debug = require('debug')('server');

exports.getAll = (req, res) => {
  models.role.findAll({
    attributes: ['role_id', 'decision_id', 'prev_id', 'next_id', 'state', 'creator_id', 'modified_datetime',
     'name', 'member', 'role', 'proceeding', 'decision', 'activity', 'receipt'],
    where: { group_id: req.params.group_id }
  }).then((result) => {
    res.json(result.map(row => {
      return {
        id: row.dataValues.role_id,
        prevId: row.dataValues.prev_id,
        nextId: row.dataValues.next_id,
        state: row.dataValues.state,
        creator: row.dataValues.creator_id,
        modifiedDate: row.dataValues.modified_datetime,
        name: row.dataValues.name,
        member: row.dataValues.member,
        role: row.dataValues.role,
        proceeding: row.dataValues.proceeding,
        decision: row.dataValues.decision,
        activity: row.dataValues.activity,
        receipt: row.dataValues.receipt,
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
  models.role.findOne({
    attributes: ['role_id', 'decision_id', 'prev_id', 'next_id', 'state', 'creator_id', 'modified_datetime',
     'name', 'member', 'role', 'proceeding', 'decision', 'activity', 'receipt'],
    where: { group_id: req.params.group_id, role_id: +req.params.role_id }
  }).then((result) => {
    res.json({
      id: result.role_id,
      prevId: result.prev_id,
      nextId: result.next_id,
      state: result.state,
      creator: result.creator_id,
      modifiedDate: result.modified_datetime,
      name: result.name,
      member: result.member,
      role: result.role,
      proceeding: result.proceeding,
      decision: result.decision,
      activity: result.activity,
      receipt: result.receipt,
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
