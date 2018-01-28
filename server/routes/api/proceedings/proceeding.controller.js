const decisionController = require('../decisions/decision.controller');
const db = require('../../../database');
const debug = require('debug')('proceeding');


exports.authCreate = (req, res, next) => {
  const CREATE = 1;
  if (req.permissions.proceeding & CREATE)
    next();
  else
    res.status(403).json({
      success: false,
      message: 'permission denied'
    });
}

exports.authCreateOrUpdate = (req, res, next) => {
  const CREATE = 1;
  const UPDATE = 4;
  if (req.permissions.proceeding & CREATE || req.permissions.proceeding & UPDATE)
    next();
  else
    res.status(403).json({
      success: false,
      message: 'permission denied'
    });
}

exports.authRead = (req, res, next) => {
  const READ = 2;
  if (req.permissions.proceeding & READ)
    next();
  else
    res.status(403).json({
      success: false,
      message: 'permission denied'
    });
}

exports.authUpdate = (req, res, next) => {
  const UPDATE = 4;
  if (req.permissions.proceeding & UPDATE)
    next();
  else
    res.status(403).json({
      success: false,
      message: 'permission denied'
    });
}

exports.authDelete = (req, res, next) => {
  const DELETE = 8;
  if (req.permissions.proceeding & DELETE)
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
      WHERE group_id=? AND user_id=UNHEX(?)', [req.permissions.group_id, req.decoded.user_id]);
    debug(member_id[0]);

    let result = await db.execute(
      'SELECT P.proceeding_id, P.prev_id, P.next_id, P.created_datetime, P.meeting_datetime,\
        P.title, P.description,\
        get_state(P.document_state) AS document_state,\
        count(distinct A.member_id) AS attendees_count,\
        count(distinct M.user_id) AS reviewers_count,\
        count(distinct (case when A.attendee_state=1 then A.member_id end)) AS reviewed_attendees_count,\
        count(distinct D.decision_id) AS child_decisions_count,\
        count(distinct (case when P.document_state=0 and P.next_id=0 and A.member_id=? and A.attendee_state=0 then 1 end)) AS need_my_review\
      FROM proceeding P\
        LEFT JOIN attendee A ON A.group_id=P.group_id AND A.proceeding_id=P.proceeding_id\
        LEFT JOIN member M ON M.group_id=A.group_id AND M.member_id=A.member_id\
        LEFT JOIN decision D ON D.group_id=P.group_id AND D.proceeding_id=P.proceeding_id\
      WHERE P.group_id=? AND P.next_id=0\
      GROUP BY P.proceeding_id', [member_id[0][0].member_id, req.permissions.group_id]);
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
      WHERE group_id=? AND user_id=UNHEX(?)', [req.permissions.group_id, req.decoded.user_id]);
    debug(member_id[0]);

    let proceeding = await db.execute(
      'SELECT *, get_state(P.document_state) AS document_state,\
      count(distinct case when P.document_state=0 and P.next_id=0 and A.member_id=? and A.attendee_state=0 then 1 end) AS need_my_review\
      FROM proceeding P\
        LEFT JOIN attendee A ON A.group_id=P.group_id AND A.proceeding_id=P.proceeding_id\
      WHERE P.group_id=? AND P.proceeding_id=?', [member_id[0][0].member_id, req.permissions.group_id, req.params.proceeding_id]);

    let child_decisions = await db.execute(
      'SELECT *, get_state(document_state) AS document_state\
      FROM decision\
      WHERE group_id=? AND proceeding_id=?', [req.permissions.group_id, +req.params.proceeding_id]);
    proceeding[0][0].child_decisions = child_decisions[0];

    let attendees = await db.execute(
      'SELECT *, get_member_state(member_state) AS member_state\
      FROM attendee A\
      LEFT JOIN member M ON M.group_id=A.group_id AND M.member_id=A.member_id\
      WHERE A.group_id=? AND A.proceeding_id=?', [req.permissions.group_id, req.params.proceeding_id]);
    proceeding[0][0].reviewers = attendees[0]
      .filter(attendee => attendee.user_id != null)
      .map(attendee => {delete attendee.user_id; return attendee;});
    proceeding[0][0].attendees = attendees[0]
      .map(attendee => {delete attendee.user_id; return attendee;});
    proceeding[0][0].reviewed_attendees = attendees[0]
      .filter(attendee => attendee.attendee_state == 1/*REVIEWED*/)
      .map(attendee => {delete attendee.user_id; return attendee;});

    if (proceeding[0][0].next_id > 0)
      res.setHeader('Cache-Control', 'public, max-age=2592000');
    res.send(proceeding[0][0]);
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
}

exports.updateByID = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    let member_id = await conn.query(
      'SELECT member_id\
      FROM member\
      WHERE group_id=? AND user_id=UNHEX(?)', [req.permissions.group_id, req.decoded.user_id]);
    debug(member_id[0]);

    await conn.query(
      'UPDATE attendee\
      SET attendee_state=1\
      WHERE group_id=? AND proceeding_id=? AND member_id=?', [req.permissions.group_id, req.params.proceeding_id, member_id[0][0].member_id]);

    let attendee = await conn.query(
      'SELECT\
      count(distinct M.user_id) AS reviewers_count,\
      count(distinct (case when A.attendee_state=1 then A.member_id end)) AS reviewed_attendees_count\
      FROM attendee A\
      LEFT JOIN member M ON M.group_id=A.group_id AND M.member_id=A.member_id\
      WHERE A.group_id=? AND A.proceeding_id=?\
      GROUP BY A.proceeding_id', [req.permissions.group_id, req.params.proceeding_id]);
    debug(attendee[0][0].reviewed_attendees_count + ' ' + attendee[0][0].reviewers_count);

    if (attendee[0][0].reviewed_attendees_count > 0 /*== attendee[0][0].reviewers_count*/) {
      await conn.query(
        'UPDATE proceeding\
        SET document_state=2\
        WHERE group_id=? AND proceeding_id=?', [req.permissions.group_id, req.params.proceeding_id]);
      await conn.query(
        'UPDATE decision\
        SET document_state=document_state+2\
        WHERE group_id=? AND proceeding_id=?', [req.permissions.group_id, req.params.proceeding_id]);

      let need_update_child_decisions = await conn.query(
        'SELECT *\
        FROM decision\
        WHERE group_id=? AND proceeding_id=? AND prev_id!=0', [req.permissions.group_id, req.params.proceeding_id]);
      let decision_stack = need_update_child_decisions[0];
      let visited = {};

      while (decision_stack.length) {
        let decision = decision_stack[decision_stack.length - 1];

        if (visited[decision.decision_id]) {
          conn.query(
            'UPDATE decision SET next_id=?\
            WHERE group_id=? AND decision_id=? AND next_id=0', [decision.decision_id, req.permissions.group_id, decision.prev_id])
          decision_stack.pop();
          continue;
        }
        let prev = await conn.query(
          'SELECT * FROM decision\
          WHERE group_id=? AND decision_id=? AND prev_id!=0 AND next_id=0', [req.permissions.group_id, decision.prev_id]);
        if (prev[0][0])
          decision_stack.push(prev[0][0]);
        visited[decision.decision_id] = true;
      }
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

exports.insertProceeding = async (conn, proceeding) => {

  await conn.query(
    'INSERT INTO proceeding\
    VALUES(?,?,?,0,?,?,?,?,?)', [
      proceeding.group_id,
      proceeding.proceeding_id,
      proceeding.prev_id,
      proceeding.document_state,
      new Date().toISOString().substring(0, 19).replace('T', ' '),
      new Date(proceeding.meeting_datetime).toISOString().substring(0, 19).replace('T', ' '),
      proceeding.title,
      proceeding.description
    ]);

  if (proceeding.attendee_ids) {
    await Promise.all(proceeding.attendee_ids.map(
      attendee_id => conn.query(
        'INSERT INTO attendee\
        VALUES(?,?,?,0)', [proceeding.group_id, proceeding.proceeding_id, attendee_id])));
  }

  if (proceeding.prev_id) {
    let updatePrev = await conn.query(
      'UPDATE proceeding\
      SET next_id=?\
      WHERE group_id=? AND proceeding_id=? AND next_id=0', [
        proceeding.proceeding_id,
        proceeding.group_id,
        proceeding.prev_id
      ]);
    if (updatePrev[0].affectedRows == 0)
      throw 'Invalid target proceeding id';
  }

  if (proceeding.child_decisions && proceeding.child_decisions.length > 0) {
    await Promise.all(proceeding.child_decisions.map(decision => {
      decision.group_id = proceeding.group_id;
      decision.proceeding_id = proceeding.proceeding_id;
      decision.meeting_datetime = proceeding.meeting_datetime;
      return decisionController.insertDecision(conn, decision);
    }));
  }
}

exports.create = async (req, res) => {
  const conn = await db.getConnection();
  debug('create');
  try {
    await conn.beginTransaction();
    debug(req.body);
    if (!req.body.meeting_datetime) throw 'Invalid meeting_datetime';
    if (!(req.body.attendee_ids.length > 1)) throw 'Need at least two attendees';

    let proceeding_new_id = await conn.query('SELECT GET_SEQ(?,"proceeding") AS new_id', [req.permissions.group_id]);

    let proceeding = req.body;
    proceeding.group_id = req.permissions.group_id;
    proceeding.proceeding_id = proceeding_new_id[0][0].new_id;
    proceeding.document_state = 0; /* PENDING_ADDS */
    await module.exports.insertProceeding(conn, proceeding);

    let result = await conn.query(
      'SELECT count(distinct M.user_id) AS reviewers_count,\
      count(distinct (case when M.user_id=unhex(?) then 1 end)) AS need_my_review\
      FROM attendee A\
      LEFT JOIN member M ON M.group_id=A.group_id AND M.member_id=A.member_id\
      WHERE A.group_id=? AND A.proceeding_id=?', [req.decoded.user_id, req.permissions.group_id, proceeding.proceeding_id]);

    await conn.commit();
    conn.release();

    res.send({
      proceeding_id: proceeding_new_id[0][0].new_id,
      document_state: "PENDING_ADDS",
      reviewers_count: result[0][0].reviewers_count,
      need_my_review: result[0][0].need_my_review
    });
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
