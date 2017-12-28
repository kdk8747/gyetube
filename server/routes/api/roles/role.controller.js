const db = require('../../../database');
const debug = require('debug')('role');


exports.authRead = (req, res, next) => {
  const READ = 2;
  if (req.decoded && req.decoded.permissions && req.decoded.permissions.groups
    && (req.decoded.permissions.groups[req.params.group_id].role & READ))
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
      'SELECT *, get_state(document_state) AS document_state\
      FROM role\
      WHERE group_id=?', [req.params.group_id]);
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
    let role = await db.execute(
      'SELECT *, get_state(document_state) AS document_state\
      FROM role\
      WHERE group_id=? AND role_id=?', [req.params.group_id, req.params.role_id]);

    let parent_decision = await db.execute(
      'SELECT *, get_state(document_state) AS document_state\
        FROM decision\
        WHERE group_id=? AND decision_id=?', [req.params.group_id, role[0][0].decision_id]);
    role[0][0].parent_decision = parent_decision[0][0];

    let creator = await db.execute(
      'SELECT *, get_state(document_state) AS document_state\
      FROM member\
      WHERE group_id=? AND member_id=?', [req.params.group_id, role[0][0].creator_id]);
    role[0][0].creator = creator[0][0];

    res.send(role[0][0]);
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
}

exports.updateByID = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'groupId: not found'
  });
}

exports.create = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    let member_id = await conn.query(
      'SELECT member_id\
      FROM member\
      WHERE group_id=? AND user_id=UNHEX(?)', [req.params.group_id, req.decoded.user_id]);
    debug(member_id[0]);

    debug(req.body);
    if (!(req.body.name.length < 32)) throw 'Invalid name';
    if (!req.body.parent_decision_id) throw 'need parent document';

    let role_new_id = await conn.query('SELECT GET_SEQ(?,"role") AS new_id', [req.params.group_id]);

    await conn.query(
      'INSERT INTO role\
      VALUES(?,?,?,0,?,NOW(),?, ?,?,?,?,?,?, ?,?)', [
        req.params.group_id,
        role_new_id[0][0].new_id,
        req.body.prev_id,
        req.body.prev_id ? 3 /*UPDATED*/ : 2/*ADDED*/,
        req.body.name,

        req.body.member,
        req.body.role,
        req.body.proceeding,
        req.body.decision,
        req.body.activity,
        req.body.receipt,
        member_id[0][0].member_id,
        req.body.parent_decision_id
      ]);

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
