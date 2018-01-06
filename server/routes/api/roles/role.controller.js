const db = require('../../../database');
const debug = require('debug')('role');
const jwt = require('jsonwebtoken');


exports.checkLogin = (req, res, next) => {
  if (req.decoded && req.decoded.user_id)
    next();
  else
    res.status(403).json({
      success: false,
      message: 'permission denied'
    });
}

exports.authCreate = (req, res, next) => {
  const CREATE = 1;
  if (req.permissions.role & CREATE)
    next();
  else
    res.status(403).json({
      success: false,
      message: 'permission denied'
    });
}

exports.authRead = (req, res, next) => {
  const READ = 2;
  if (req.permissions.role & READ)
    next();
  else
    res.status(403).json({
      success: false,
      message: 'permission denied'
    });
}

exports.authUpdate = (req, res, next) => {
  const UPDATE = 4;
  if (req.permissions.role & UPDATE)
    next();
  else
    res.status(403).json({
      success: false,
      message: 'permission denied'
    });
}

exports.authDelete = (req, res, next) => {
  const DELETE = 8;
  if (req.permissions.role & DELETE)
    next();
  else
    res.status(403).json({
      success: false,
      message: 'permission denied'
    });
}

function bitToStringArray(bit) {
  let ret = [];
  if (bit & 1) ret.push('CREATE');
  if (bit & 2) ret.push('READ');
  if (bit & 4) ret.push('INTERACTION');
  if (bit & 8) ret.push('DELETE');
  return ret;
}

function stringArrayToBit(stringArray) {
  return stringArray.reduce((a, b) => {
    switch (b) {
      case 'CREATE': return 1 + a;
      case 'READ': return 2 + a;
      case 'INTERACTION': return 4 + a;
      case 'DELETE': return 8 + a;
      default: return a;
    }
  }, 0);
}

exports.getAll = async (req, res) => {
  try {
    let result = await db.execute(
      'SELECT *, get_state(document_state) AS document_state\
      FROM role\
      WHERE group_id=?', [req.permissions.group_id]);

    result[0] = result[0].map(role => {
      role.member = bitToStringArray(role.member);
      role.role = bitToStringArray(role.role);
      role.proceeding = bitToStringArray(role.proceeding);
      role.decision = bitToStringArray(role.decision);
      role.activity = bitToStringArray(role.activity);
      role.receipt = bitToStringArray(role.receipt);
      return role;
    });
    res.send(result[0]);
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
}

exports.getMyself = async (req, res) => {
  try {
    let role = await db.execute(
      'SELECT R.role_id, R.decision_id, R.creator_id, R.modified_datetime, R.name,\
      get_state(R.document_state) AS document_state,\
      bit_or(R.member) AS member,\
      bit_or(R.role) AS role,\
      bit_or(R.proceeding) AS proceeding,\
      bit_or(R.decision) AS decision,\
      bit_or(R.activity) AS activity,\
      bit_or(R.receipt) AS receipt\
      FROM member M\
      LEFT JOIN member_role MR ON MR.group_id=M.group_id AND MR.member_id=M.member_id\
      LEFT JOIN role R ON R.group_id=MR.group_id AND R.role_id=MR.role_id\
      WHERE M.group_id=? and M.user_id=unhex(?)\
      GROUP BY M.member_id', [req.permissions.group_id, req.decoded.user_id]);

    let parent_decision = await db.execute(
      'SELECT *, get_state(document_state) AS document_state\
        FROM decision\
        WHERE group_id=? AND decision_id=?', [req.permissions.group_id, role[0][0].decision_id]);
    role[0][0].parent_decision = parent_decision[0][0];

    let creator = await db.execute(
      'SELECT *, get_state(document_state) AS document_state\
      FROM member\
      WHERE group_id=? AND member_id=?', [req.permissions.group_id, role[0][0].creator_id]);
    role[0][0].creator = creator[0][0];

    role[0][0].member = bitToStringArray(role[0][0].member);
    role[0][0].role = bitToStringArray(role[0][0].role);
    role[0][0].proceeding = bitToStringArray(role[0][0].proceeding);
    role[0][0].decision = bitToStringArray(role[0][0].decision);
    role[0][0].activity = bitToStringArray(role[0][0].activity);
    role[0][0].receipt = bitToStringArray(role[0][0].receipt);

    res.send(role[0][0]);
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
      WHERE group_id=? AND role_id=?', [req.permissions.group_id, req.params.role_id]);

    let parent_decision = await db.execute(
      'SELECT *, get_state(document_state) AS document_state\
        FROM decision\
        WHERE group_id=? AND decision_id=?', [req.permissions.group_id, role[0][0].decision_id]);
    role[0][0].parent_decision = parent_decision[0][0];

    let creator = await db.execute(
      'SELECT *, get_state(document_state) AS document_state\
      FROM member\
      WHERE group_id=? AND member_id=?', [req.permissions.group_id, role[0][0].creator_id]);
    role[0][0].creator = creator[0][0];

    role[0][0].member = bitToStringArray(role[0][0].member);
    role[0][0].role = bitToStringArray(role[0][0].role);
    role[0][0].proceeding = bitToStringArray(role[0][0].proceeding);
    role[0][0].decision = bitToStringArray(role[0][0].decision);
    role[0][0].activity = bitToStringArray(role[0][0].activity);
    role[0][0].receipt = bitToStringArray(role[0][0].receipt);

    res.send(role[0][0]);
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

    debug(req.body);
    if (!(req.body.name.length < 32)) throw 'Invalid name';
    if (!req.body.parent_decision_id) throw 'need parent document';

    await conn.query(
      'INSERT INTO role_log (group_id, role_log_id, role_id, document_state, creator_id, created_datetime,\
        name, member, role, proceeding, decision, activity, receipt)\
      SELECT group_id, GET_SEQ(group_id,"role_log"), role_id, document_state, creator_id, modified_datetime,\
        name, member, role, proceeding, decision, activity, receipt\
      FROM role\
      WHERE group_id=? AND role_id=?', [
        req.permissions.group_id,
        req.params.role_id
      ]);

    await conn.query(
      'UPDATE role\
      SET created_datetime=?, name=?, member=?, role=?, proceeding=?, decision=?, activity=?, receipt=?,\
        creator_id=?, decision_id=?\
      WHERE group_id=? AND role_id=?', [
        new Date().toISOString().substring(0, 19).replace('T', ' '),
        req.body.name,

        stringArrayToBit(req.body.member),
        stringArrayToBit(req.body.role),
        stringArrayToBit(req.body.proceeding),
        stringArrayToBit(req.body.decision),
        stringArrayToBit(req.body.activity),
        stringArrayToBit(req.body.receipt),
        member_id[0][0].member_id,
        req.body.parent_decision_id,

        req.permissions.group_id,
        req.params.role_id
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

exports.create = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    let member_id = await conn.query(
      'SELECT member_id\
      FROM member\
      WHERE group_id=? AND user_id=UNHEX(?)', [req.permissions.group_id, req.decoded.user_id]);
    debug(member_id[0]);

    debug(req.body);
    if (!(req.body.name.length < 32)) throw 'Invalid name';
    if (!req.body.parent_decision_id) throw 'need parent document';

    let role_new_id = await conn.query('SELECT GET_SEQ(?,"role") AS new_id', [req.permissions.group_id]);

    await conn.query(
      'INSERT INTO role\
      VALUES(?,?,?,?, ?,?,?,?,?,?, ?,?,2)', [
        req.permissions.group_id,
        role_new_id[0][0].new_id,
        new Date().toISOString().substring(0, 19).replace('T', ' '),
        req.body.name,

        stringArrayToBit(req.body.member),
        stringArrayToBit(req.body.role),
        stringArrayToBit(req.body.proceeding),
        stringArrayToBit(req.body.decision),
        stringArrayToBit(req.body.activity),
        stringArrayToBit(req.body.receipt),
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
