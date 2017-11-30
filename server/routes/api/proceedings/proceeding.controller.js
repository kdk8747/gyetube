const decisionController = require('../decisions/decision.controller');
const models = require('../../../models');
const debug = require('debug')('server');


exports.getAll = (req, res) => {
  models.proceeding.findAll({
    attributes: ['proceeding_id', 'prev_id', 'next_id', 'state', 'created_datetime', 'meeting_datetime', 'title', 'description'],
    where: { group_id: req.params.group_id }
  }).then((result) => {
    res.json(result.map(row => {
      return {
        id: row.dataValues.proceeding_id,
        prevId: row.dataValues.prev_id,
        nextId: row.dataValues.next_id,
        state: row.dataValues.state,
        createdDate: row.dataValues.created_datetime,
        meetingDate: row.dataValues.meeting_datetime,
        attendees: [],//row.dataValues.image_url,
        reviewers: [],//row.dataValues.image_url,
        title: row.dataValues.title,
        description: row.dataValues.description,
        childDecisions: [],//row.dataValues.decision_id
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
  models.proceeding.findOne({
    attributes: ['proceeding_id', 'prev_id', 'next_id', 'state', 'created_datetime', 'meeting_datetime', 'title', 'description'],
    where: { group_id: req.params.group_id, proceeding_id: +req.params.proceeding_id }
  }).then((result) => {
    res.json({
      id: result.proceeding_id,
      prevId: result.prev_id,
      nextId: result.next_id,
      state: result.state,
      createdDate: result.created_datetime,
      meetingDate: result.meeting_datetime,
      attendees: [],//result.image_url,
      reviewers: [],//result.image_url,
      title: result.title,
      description: result.description,
      childDecisions: [],//result.decision_id
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
    res.status(401).json({
      success: false,
      message: 'not allowed'
    });
  }
  else if (req.params.group === 'suwongreenparty') {
    if (req.params.group in req.decoded.permissions.groups) {
      let found = proceedings.find(item => item.id === +req.params.id);
      if (found && found.nextId == 0) {
        if (found.attendees.find(item => item === req.decoded.id)
          && !found.reviewers.find(item => item === req.decoded.id)) {
          found.reviewers.push(req.decoded.id);
        }

        if (found.attendees.length == found.reviewers.length) {
          found.state = 0; // NEW_ONE
          for (let j = 0; j < found.childDecisions.length; j++) {
            req.body = found.childDecisions[j];
            decisionController.overThePendingState(req);
          }
        }
      }
      res.json(found);
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
  if (req.params.group === 'examplelocalparty') {
    res.status(401).json({
      success: false,
      message: 'not allowed'
    });
  }
  else if (req.params.group === 'suwongreenparty') {
    if (req.params.group in req.decoded.permissions.groups) {
      let newProceeding = req.body;
      newProceeding.id = proceedingID;
      if (+newProceeding.prevId > 0) {
        let prev = proceedings.find(item => item.id === +newProceeding.prevId);
        if (prev.nextId == 0) {
          prev.nextId = newProceeding.id;
        }
        else {
          res.status(405).json({
            success: false,
            message: 'The target proceeding is already revised'
          });
          return;
        }
      }

      if (newProceeding.childDecisions) {
        let childIdList = [];
        for (let i = 0; i < newProceeding.childDecisions.length; i++) {
          req.body = newProceeding.childDecisions[i];
          let id = decisionController.create(req, newProceeding.id);
          if (id) childIdList.push(id);
          else {
            res.status(405).json({
              success: false,
              message: 'One of the target proceeding.childDecision is already revised'
            });
            return;
          }
        }
        newProceeding.childDecisions = childIdList;
      }

      proceedingID++;
      proceedings.push(newProceeding);
      res.json(newProceeding);
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
