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
    let member_id = await db.execute(
      'SELECT member_id\
      FROM member\
      WHERE group_id=? AND user_id=UNHEX(?)', [req.params.group_id, req.decoded.user_id]);
    debug(member_id[0]);

    let result = await db.execute(
      'SELECT P.proceeding_id, P.prev_id, P.next_id, P.created_datetime, P.meeting_datetime,\
        P.title, P.description,\
        get_state(P.document_state) AS document_state,\
        count(distinct A.member_id) AS attendees_count,\
        count(distinct (case when A.attendee_state=1 then A.member_id end)) AS reviewers_count,\
        count(distinct D.decision_id) AS child_decisions_count,\
        count(distinct case when P.document_state=0 and A.member_id=? and A.attendee_state=0 then 1 end) AS need_my_review\
      FROM proceeding P\
        LEFT JOIN attendee A ON A.group_id=? AND A.proceeding_id=P.proceeding_id\
        LEFT JOIN decision D ON D.group_id=? AND D.proceeding_id=P.proceeding_id\
      WHERE P.group_id=? AND P.next_id=0\
      GROUP BY P.proceeding_id', [member_id[0][0].member_id, req.params.group_id, req.params.group_id, req.params.group_id]);
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
    let member_id = await db.execute(
      'SELECT member_id\
      FROM member\
      WHERE group_id=? AND user_id=UNHEX(?)', [req.params.group_id, req.decoded.user_id]);
    debug(member_id[0]);

    let proceeding = await db.execute(
      'SELECT *, get_state(P.document_state) AS document_state,\
      count(distinct case when P.document_state=0 and A.member_id=? and A.attendee_state=0 then 1 end) AS need_my_review\
      FROM proceeding P\
        LEFT JOIN attendee A ON A.group_id=? AND A.proceeding_id=P.proceeding_id\
      WHERE P.group_id=? AND P.proceeding_id=?', [member_id[0][0].member_id, req.params.group_id, req.params.group_id, +req.params.proceeding_id]);

    let child_decisions = await db.execute(
      'SELECT *, get_state(document_state) AS document_state\
      FROM decision\
      WHERE group_id=? AND proceeding_id=?', [req.params.group_id, +req.params.proceeding_id]);
    proceeding[0][0].child_decisions = child_decisions[0];

    let attendees = await db.execute(
      'SELECT *, get_state(document_state) AS document_state\
      FROM attendee A\
      LEFT JOIN member M ON M.group_id=? AND M.member_id=A.member_id\
      WHERE A.group_id=? AND A.proceeding_id=?', [req.params.group_id, req.params.group_id, +req.params.proceeding_id]);
    proceeding[0][0].attendees = attendees[0];
    proceeding[0][0].reviewers = attendees[0].filter(attendee => attendee.attendee_state == 1/*REVIEWED*/);

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

exports.create = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    debug(req.body);
    if (!req.body.meeting_datetime) throw 'Invalid meeting_datetime';
    if (!(req.body.attendee_ids.length > 1)) throw 'Need at least two attendees';

    let proceeding_new_id = await conn.query('SELECT GET_SEQ(?,"proceeding") AS new_id', [req.params.group_id]);

    await conn.query(
      'INSERT INTO proceeding\
      VALUES(?,?,?,0,?,NOW(),?,?,?)', [
        req.params.group_id,
        proceeding_new_id[0][0].new_id,
        req.body.prev_id,
        req.body.prev_id ? 1 /*PENDING_UPDATES*/ : 0/*PENDING_ADDS*/,
        new Date(req.body.meeting_datetime).toISOString().substring(0, 19).replace('T', ' '),
        req.body.title,
        req.body.description
      ]);

    await Promise.all(req.body.attendee_ids.map(
      attendee_id => conn.query(
        'INSERT INTO attendee\
        VALUES(?,?,?,0)', [req.params.group_id, proceeding_new_id[0][0].new_id, attendee_id])));

    if (req.body.prev_id) {
      let updatePrev = await conn.query(
        'UPDATE proceeding\
        SET next_id=?\
        WHERE group_id=? AND proceeding_id=? AND next_id=0', [
          proceeding_new_id[0][0].new_id,
          req.params.group_id,
          req.body.prev_id
        ]);
      if (updatePrev[0].affectedRows == 0);
      throw 'The target proceeding is already revised';
    }

    if (req.body.child_decisions && req.body.child_decisions.length > 0) {
      await Promise.all(req.body.child_decisions.map(decision => {
        decision.group_id = req.params.group_id;
        decision.proceeding_id = proceeding_new_id[0][0].new_id;
        decision.meeting_datetime = req.body.meeting_datetime;
        return decisionController.create(conn, decision);
      }));
    }

    await conn.commit();
    conn.release();

    res.send();
  }
  catch (err) {
    if (!conn.connection._fatalError) {
      conn.rollback();
      conn.release();
    }
    res.status(500).json({
      success: false,
      message: err
    });
  }
}
