const db = require('../../../database');
const debug = require('debug')('server');


exports.getAll = async (req, res) => {
  try {
    let result = await db.execute(
      'SELECT D.decision_id, D.prev_id, D.next_id, D.document_state, D.expiry_datetime, D.meeting_datetime,\
        D.title, D.description,\
        count(distinct (case when V.voter_state=0 then V.member_id end)) AS abstainers_count,\
        count(distinct (case when V.voter_state=1 then V.member_id end)) AS accepters_count,\
        count(distinct (case when V.voter_state=2 then V.member_id end)) AS rejecters_count,\
        count(distinct A.activity_id) AS child_activities_count,\
        count(distinct R.receipt_id) AS child_receipts_count,\
        D.total_elapsed_time, D.total_difference\
      FROM decision D\
        LEFT JOIN voter V ON V.group_id=D.group_id AND V.decision_id=D.decision_id\
        LEFT JOIN activity A ON A.group_id=D.group_id AND A.decision_id=D.decision_id\
        LEFT JOIN receipt R ON R.group_id=D.group_id AND R.decision_id=D.decision_id\
      WHERE D.group_id=?\
      GROUP BY D.decision_id', [req.params.group_id]);
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
    let decision = await db.execute(
      'SELECT *\
      FROM decision\
      WHERE group_id=? AND decision_id=?', [req.params.group_id, req.params.decision_id]);

    let parent_proceeding = await db.execute(
      'SELECT *\
      FROM proceeding\
      WHERE group_id=? AND proceeding_id=?', [req.params.group_id, decision[0][0].proceeding_id]);
    decision[0][0].parent_proceeding = parent_proceeding[0][0];

    let child_members = await db.execute(
      'SELECT *\
      FROM member\
      WHERE group_id=? AND decision_id=?', [req.params.group_id, req.params.decision_id]);
    decision[0][0].child_members = child_members[0];

    let child_roles = await db.execute(
      'SELECT *\
      FROM role\
      WHERE group_id=? AND decision_id=?', [req.params.group_id, req.params.decision_id]);
    decision[0][0].child_roles = child_roles[0];

    let child_activities = await db.execute(
      'SELECT A.activity_id, A.modified_datetime, A.activity_datetime, A.title, A.description,\
      A.elapsed_time, A.total_difference, count(distinct P.member_id) AS participants_count\
      FROM activity A\
      LEFT JOIN participant P ON P.group_id=A.group_id AND P.activity_id=A.activity_id\
      WHERE A.group_id=? AND A.decision_id=?\
      GROUP BY A.activity_id', [req.params.group_id, req.params.decision_id]);
    decision[0][0].child_activities = child_activities[0];

    let child_receipts = await db.execute(
      'SELECT *\
      FROM receipt\
      WHERE group_id=? AND decision_id=?', [req.params.group_id, req.params.decision_id]);
    decision[0][0].child_receipts = child_receipts[0];

    let voters = await db.execute(
      'SELECT *\
      FROM voter V\
      LEFT JOIN member M ON M.group_id=? AND M.member_id=V.member_id\
      WHERE V.group_id=? AND V.decision_id=?', [req.params.group_id, req.params.group_id, req.params.decision_id]);
    decision[0][0].voters = voters[0];

    res.send(decision[0][0]);
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
