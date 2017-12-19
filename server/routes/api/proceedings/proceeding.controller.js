const decisionController = require('../decisions/decision.controller');
const db = require('../../../database');
const debug = require('debug')('proceeding');


exports.authRead = (req, res, next) => {
  const READ = 2;
  if (req.decoded && req.decoded.permissions && req.decoded.permissions.groups
    && (req.decoded.permissions.groups[req.params.group_id].proceeding & READ))
    next();
  else
    res.status(403).json({
      success: false,
      message: 'permission denied'
    });
}

exports.getAll = async (req, res) => {
  try {
    let result = await db.execute(
      'SELECT P.proceeding_id, P.prev_id, P.next_id, P.document_state, P.created_datetime, P.meeting_datetime,\
        P.title, P.description,\
        count(distinct A.member_id) AS attendees_count,\
        count(distinct (case when A.attendee_state=1 then A.member_id end)) AS reviewers_count,\
        count(distinct D.decision_id) AS child_decisions_count\
      FROM proceeding P\
        LEFT JOIN attendee A ON A.group_id=? AND A.proceeding_id=P.proceeding_id\
        LEFT JOIN decision D ON D.group_id=? AND D.proceeding_id=P.proceeding_id\
      WHERE P.group_id=?\
      GROUP BY P.proceeding_id', [req.params.group_id, req.params.group_id, req.params.group_id]);
    res.send(result[0]);
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
}

exports.getByID = async (req, res) => {
  try {
    let proceeding = await db.execute(
      'SELECT *\
      FROM proceeding\
      WHERE group_id=? AND proceeding_id=?', [req.params.group_id, +req.params.proceeding_id]);

    let child_decisions = await db.execute(
      'SELECT *\
      FROM decision\
      WHERE group_id=? AND proceeding_id=?', [req.params.group_id, +req.params.proceeding_id]);
    proceeding[0][0].child_decisions = child_decisions[0];

    let attendees = await db.execute(
      'SELECT *\
      FROM attendee A\
      LEFT JOIN member M ON M.group_id=? AND M.member_id=A.member_id\
      WHERE A.group_id=? AND A.proceeding_id=?', [req.params.group_id, req.params.group_id, +req.params.proceeding_id]);
    proceeding[0][0].attendees = attendees[0];

    res.send(proceeding[0][0]);
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
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
