const models = require('../../../models');
const debug = require('debug')('server');


exports.getAll = (req, res) => {
  models.decision.findAll({
    attributes: ['decision_id', 'proceeding_id', 'prev_id', 'next_id', 'state', 'meeting_datetime', 'expiry_datetime',
      'title', 'description', 'total_elapsed_time', 'total_difference'],
    where: { group_id: req.params.group_id }
  }).then((result) => {
    res.json(result.map(row => {
      return {
        id: row.dataValues.proceeding_id,
        prevId: row.dataValues.prev_id,
        nextId: row.dataValues.next_id,
        state: row.dataValues.state,
        meetingDate: row.dataValues.meeting_datetime,
        expiryDate: row.dataValues.expiry_datetime,
        accepters: [],//row.dataValues.image_url,
        rejecters: [],//row.dataValues.image_url,
        abstainers: [],//row.dataValues.image_url,
        title: row.dataValues.title,
        description: row.dataValues.description,
        totalElapsedTime: row.dataValues.total_elapsed_time,
        totalDifference: row.dataValues.total_difference,
        childActivities: [],//row.dataValues.decision_id
        childReceipts: [],//row.dataValues.decision_id
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
  models.decision.findOne({
    attributes: ['decision_id', 'proceeding_id', 'prev_id', 'next_id', 'state', 'meeting_datetime', 'expiry_datetime',
      'title', 'description', 'total_elapsed_time', 'total_difference'],
    where: { group_id: req.params.group_id, decision_id: +req.params.decision_id }
  }).then((result) => {
    res.json({
      id: result.proceeding_id,
      prevId: result.prev_id,
      nextId: result.next_id,
      state: result.state,
      meetingDate: result.meeting_datetime,
      expiryDate: result.expiry_datetime,
      accepters: [],//result.image_url,
      rejecters: [],//result.image_url,
      abstainers: [],//result.image_url,
      title: result.title,
      description: result.description,
      totalElapsedTime: result.total_elapsed_time,
      totalDifference: result.total_difference,
      childActivities: [],//result.decision_id
      childReceipts: [],//result.decision_id
    });
  }).catch((reason => {
    res.status(400).json({
      success: false,
      message: reason
    });
  }));
}

exports.updateByID = (req, res) => {
  if (req.params.group === 'examplelocalparty') {
    let i = decisions2.findIndex(item => item.id === +req.params.id);
    decisions2[i] = req.body;
    res.send();
  }
  else if (req.params.group === 'suwongreenparty') {
    if (req.params.group in req.decoded.permissions.groups) {
      let i = decisions.findIndex(item => item.id === +req.params.id);
      decisions[i] = req.body;
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

exports.create = (req, parentId) => {
  if (req.params.group === 'examplelocalparty') {
  }
  else if (req.params.group === 'suwongreenparty') {
    if (req.params.group in req.decoded.permissions.groups) {
      let newDecision = req.body;
      let found = decisions.find(item => item.id == +newDecision.id
        && item.prevId == +newDecision.prevId
        && item.nextId == +newDecision.nextId
        && item.state == +newDecision.state
        && item.title == newDecision.title
        && item.description == newDecision.description
      );
      if (found && newDecision.state > 2) {
        found.parentProceeding = parentId;
      }
      else {
        newDecision.id = decisionID;
        newDecision.parentProceeding = parentId;
        if (+newDecision.prevId > 0) {
          let prev = decisions.find(item => item.id === +newDecision.prevId);
          if (prev && prev.nextId != 0)
            return 0;
        }
        decisionID++;
        decisions.push(newDecision);
      }
      return newDecision.id;
    }
  }
  return 0;
}

exports.overThePendingState = (req) => {
  if (req.params.group === 'examplelocalparty') {
  }
  else if (req.params.group === 'suwongreenparty') {
    if (req.params.group in req.decoded.permissions.groups) {
      let id = req.body;
      let found = decisions.find(item => item.id === +id);
      if (found && found.state > 2) {
        found.state -= 3;
        if (+found.prevId > 0)
          decisions.find(item => item.id === +found.prevId).nextId = found.id;
      }
    }
  }
}
