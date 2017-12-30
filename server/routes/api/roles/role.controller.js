const db = require('../../../database');
const debug = require('debug')('role');


exports.authAny = (req, res, next) => {
  if (req.decoded && req.decoded.permissions && req.decoded.permissions.groups
    && req.params.group_id in req.decoded.permissions.groups)
    next();
  else
    res.status(403).json({
      success: false,
      message: 'permission denied'
    });
}

exports.authCreate = (req, res, next) => {
  const CREATE = 1;
  if (req.decoded.permissions.groups[req.params.group_id].role & CREATE)
    next();
  else
    res.status(403).json({
      success: false,
      message: 'permission denied'
    });
}

exports.authRead = (req, res, next) => {
  const READ = 2;
  if (req.decoded.permissions.groups[req.params.group_id].role & READ)
    next();
  else
    res.status(403).json({
      success: false,
      message: 'permission denied'
    });
}

exports.authUpdate = (req, res, next) => {
  const UPDATE = 4;
  if (req.decoded.permissions.groups[req.params.group_id].role & UPDATE)
    next();
  else
    res.status(403).json({
      success: false,
      message: 'permission denied'
    });
}

exports.authDelete = (req, res, next) => {
  const DELETE = 8;
  if (req.decoded.permissions.groups[req.params.group_id].role & DELETE)
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
      WHERE group_id=?', [req.params.group_id]);

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
      VALUES(?,?,?,0,?,?,?, ?,?,?,?,?,?, ?,?)', [
        req.params.group_id,
        role_new_id[0][0].new_id,
        req.body.prev_id,
        req.body.prev_id ? 3 /*UPDATED*/ : 2/*ADDED*/,
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
