const db = require('../../../database');
const debug = require('debug')('decision');

const STATE_ABSTAINER = 0;
const STATE_ACCEPTER = 1;
const STATE_REJECTER = 2;


exports.authRead = (req, res, next) => {
  const READ = 2;
  if (req.permissions.decision & READ)
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
      'SELECT D.decision_id, D.prev_id, D.next_id, D.expiry_datetime, D.meeting_datetime,\
        D.title, D.description,\
        get_state(D.document_state) AS document_state,\
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
      GROUP BY D.decision_id', [req.permissions.group_id]);
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
      'SELECT *, get_state(document_state) AS document_state\
      FROM decision\
      WHERE group_id=? AND decision_id=?', [req.permissions.group_id, req.params.decision_id]);

    let parent_proceeding = await db.execute(
      'SELECT *, get_state(document_state) AS document_state\
      FROM proceeding\
      WHERE group_id=? AND proceeding_id=?', [req.permissions.group_id, decision[0][0].proceeding_id]);
    decision[0][0].parent_proceeding = parent_proceeding[0][0];

    let child_members = await db.execute(
      'SELECT *, get_member_state(member_state) AS member_state\
      FROM member\
      WHERE group_id=? AND decision_id=?', [req.permissions.group_id, req.params.decision_id]);
    decision[0][0].child_members = child_members[0];

    let child_roles = await db.execute(
      'SELECT *, get_state(document_state) AS document_state\
      FROM role\
      WHERE group_id=? AND decision_id=?', [req.permissions.group_id, req.params.decision_id]);
    decision[0][0].child_roles = child_roles[0];

    let child_activities = await db.execute(
      'SELECT A.activity_id, A.modified_datetime, A.activity_datetime, A.title, A.description,\
      A.elapsed_time, A.total_difference, count(distinct P.member_id) AS participants_count\
      FROM activity A\
      LEFT JOIN participant P ON P.group_id=A.group_id AND P.activity_id=A.activity_id\
      WHERE A.group_id=? AND A.decision_id=?\
      GROUP BY A.activity_id', [req.permissions.group_id, req.params.decision_id]);
    decision[0][0].child_activities = child_activities[0];

    let child_receipts = await db.execute(
      'SELECT *\
      FROM receipt\
      WHERE group_id=? AND decision_id=?', [req.permissions.group_id, req.params.decision_id]);
    decision[0][0].child_receipts = child_receipts[0];

    let voters = await db.execute(
      'SELECT *, get_member_state(member_state) AS member_state\
      FROM voter V\
      LEFT JOIN member M ON M.group_id=? AND M.member_id=V.member_id\
      WHERE V.group_id=? AND V.decision_id=?', [req.permissions.group_id, req.permissions.group_id, req.params.decision_id]);
    decision[0][0].abstainers = voters[0].filter(voter => voter.voter_state == STATE_ABSTAINER);
    decision[0][0].accepters = voters[0].filter(voter => voter.voter_state == STATE_ACCEPTER);
    decision[0][0].rejecters = voters[0].filter(voter => voter.voter_state == STATE_REJECTER);

    res.send(decision[0][0]);
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
}

exports.insertDecision = async (conn, decision) => {
  let decision_new_id = await conn.query('SELECT GET_SEQ(?,"decision") AS new_id', [decision.group_id]);

  await conn.query(
    'INSERT INTO decision\
    VALUES(?,?,?,?,0,?,?,?,?,?,0,0)', [
      decision.group_id,
      decision_new_id[0][0].new_id,
      decision.proceeding_id,
      decision.prev_id,
      decision.prev_id ? 1 /*PENDING_UPDATES*/ : 0/*PENDING_ADDS*/,
      new Date(decision.meeting_datetime).toISOString().substring(0, 19).replace('T', ' '),
      new Date(decision.expiry_datetime).toISOString().substring(0, 19).replace('T', ' '),
      decision.title,
      decision.description
    ]);

  await Promise.all(
    decision.abstainer_ids.map(member_id => conn.query(
      'INSERT INTO voter\
      VALUES(?,?,?,0)', [decision.group_id, decision_new_id[0][0].new_id, member_id])),
    decision.accepter_ids.map(member_id => conn.query(
      'INSERT INTO voter\
      VALUES(?,?,?,1)', [decision.group_id, decision_new_id[0][0].new_id, member_id])),
    decision.rejecter_ids.map(member_id => conn.query(
      'INSERT INTO voter\
      VALUES(?,?,?,2)', [decision.group_id, decision_new_id[0][0].new_id, member_id])),
  );
}
