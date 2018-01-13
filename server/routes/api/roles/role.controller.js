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
      'SELECT *, get_state(RL.document_state) AS document_state\
      FROM role R\
      LEFT JOIN role_log RL ON RL.group_id=R.group_id AND RL.role_id=R.role_id\
      WHERE R.group_id=?\
      GROUP BY R.role_id', [req.permissions.group_id]);

    result[0] = result[0].map(role => {
      role.home = bitToStringArray(role.home);
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

exports.getByID = async (req, res) => {
  try {
    let role = await db.execute(
      'SELECT *, get_state(document_state) AS document_state\
      FROM role \
      WHERE group_id=? AND role_id=?', [req.permissions.group_id, req.params.role_id]);

    let parent_decision = await db.execute(
      'SELECT *, get_state(document_state) AS document_state\
        FROM decision\
        WHERE group_id=? AND decision_id=?', [req.permissions.group_id, role[0][0].decision_id]);
    role[0][0].parent_decision = parent_decision[0][0];

    let creator = await db.execute(
      'SELECT *\
      FROM member\
      WHERE group_id=? AND member_id=?', [req.permissions.group_id, role[0][0].creator_id]);
    role[0][0].creator = creator[0][0];

    role[0][0].home = bitToStringArray(role[0][0].home);
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

exports.insertRole = async (conn, role) => {
  await conn.query(
    'INSERT INTO role\
    (group_id, role_id, decision_id, document_state, creator_id,  modified_datetime, name, home, member, role,  proceeding, decision, activity, receipt)\
    VALUES(?,?,?,?,?, ?,?,?,?,?,?, ?,?,?)', [
      role.group_id,
      role.role_id,
      role.parent_decision_id ? member.parent_decision_id : null,
      role.document_state,
      role.creator_id,

      new Date().toISOString().substring(0, 19).replace('T', ' '),
      role.name,
      role.home,
      role.member,
      role.role,

      role.proceeding,
      role.decision,
      role.activity,
      role.receipt
    ]);

  await conn.query(
    'INSERT INTO role_log\
    (group_id, role_log_id, role_id, decision_id, document_state,  creator_id, created_datetime, name, home, member,  role, proceeding, decision, activity, receipt)\
    VALUES(?,?,?,?,?, ?,?,?,?,?,?, ?,?,?,?)', [
      role.group_id,
      role.role_log_id,
      role.role_id,
      role.parent_decision_id ? member.parent_decision_id : null,
      role.document_state,

      role.creator_id,
      new Date().toISOString().substring(0, 19).replace('T', ' '),
      role.name,
      role.home,
      role.member,

      role.role,
      role.proceeding,
      role.decision,
      role.activity,
      role.receipt
    ]);
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
        name, home, member, role, proceeding, decision, activity, receipt)\
      SELECT group_id, GET_SEQ(group_id,"role_log"), role_id, document_state, creator_id, modified_datetime,\
        name, home, member, role, proceeding, decision, activity, receipt\
      FROM role\
      WHERE group_id=? AND role_id=?', [
        req.permissions.group_id,
        req.params.role_id
      ]);

    await conn.query(
      'UPDATE role\
      SET modified_datetime=?, name=?, home=?, member=?, role=?, proceeding=?, decision=?, activity=?, receipt=?,\
        creator_id=?, decision_id=?\
      WHERE group_id=? AND role_id=?', [
        new Date().toISOString().substring(0, 19).replace('T', ' '),
        req.body.name,

        stringArrayToBit(req.body.home),
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
    let author = await conn.query(
      'SELECT member_id\
      FROM member\
      WHERE group_id=? AND user_id=UNHEX(?)', [req.permissions.group_id, req.decoded.user_id]);
    debug(author[0]);

    debug(req.body);
    if (!(req.body.name.length < 32)) throw 'Invalid name';
    if (!(req.body.home instanceof Array)) throw 'Invalid home';
    if (!(req.body.member instanceof Array)) throw 'Invalid member';
    if (!(req.body.role instanceof Array)) throw 'Invalid role';
    if (!(req.body.proceeding instanceof Array)) throw 'Invalid proceeding';
    if (!(req.body.decision instanceof Array)) throw 'Invalid decision';
    if (!(req.body.activity instanceof Array)) throw 'Invalid activity';
    if (!(req.body.receipt instanceof Array)) throw 'Invalid receipt';
    if (!req.body.parent_decision_id) throw 'need parent document';

    let role_new_id = await conn.query('SELECT GET_SEQ(?,"role") AS new_id', [req.permissions.group_id]);
    let role_log_new_id = await conn.query('SELECT GET_SEQ(?,"role_log") AS new_id', [req.permissions.group_id]);
    let role = {};
    role.group_id = req.permissions.group_id;
    role.role_id = role_new_id[0][0].new_id;
    role.role_log_id = role_log_new_id[0][0].new_id;
    role.decision_id = req.body.parent_decision_id;
    role.creator_id = author[0][0].member_id;
    role.document_state = 2; /* ADDED */
    role.name = req.body.name;
    role.home = stringArrayToBit(req.body.home);
    role.member = stringArrayToBit(req.body.member);
    role.role = stringArrayToBit(req.body.role);
    role.proceeding = stringArrayToBit(req.body.proceeding);
    role.decision = stringArrayToBit(req.body.decision);
    role.activity = stringArrayToBit(req.body.activity);
    role.receipt = stringArrayToBit(req.body.receipt);
    await module.exports.insertRole(conn, role);

    await conn.commit();
    conn.release();

    res.send({
      role_id: role.role_id,
      role_log_id: role.role_log_id,
      document_state: 'ADDED',
      creator_id: author[0][0].member_id
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
