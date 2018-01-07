const db = require('../../../database');
const debug = require('debug')('member');


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
  if (req.permissions.member & CREATE)
    next();
  else
    res.status(403).json({
      success: false,
      message: 'permission denied'
    });
}

exports.authRead = (req, res, next) => {
  const READ = 2;
  if (req.permissions.member & READ)
    next();
  else
    res.status(403).json({
      success: false,
      message: 'permission denied'
    });
}

exports.authUpdate = (req, res, next) => {
  const UPDATE = 4;
  if (req.permissions.member & UPDATE)
    next();
  else
    res.status(403).json({
      success: false,
      message: 'permission denied'
    });
}

exports.authDelete = (req, res, next) => {
  const DELETE = 8;
  if (req.permissions.member & DELETE)
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
      'SELECT M.member_id, M.prev_id, M.next_id, M.created_datetime, M.image_url, M.name,\
      get_state(M.document_state) AS document_state,\
      count(distinct R.role_id) AS roles_count,\
      bit_or(R.member) AS member,\
      bit_or(R.role) AS role,\
      bit_or(R.proceeding) AS proceeding,\
      bit_or(R.decision) AS decision,\
      bit_or(R.activity) AS activity,\
      bit_or(R.receipt) AS receipt\
      FROM member M\
      LEFT JOIN member_role MR ON MR.group_id=M.group_id AND MR.member_id=M.member_id\
      LEFT JOIN role R ON R.group_id=MR.group_id AND R.role_id=MR.role_id\
      WHERE M.group_id=?\
      GROUP BY M.member_id', [req.permissions.group_id]);
    result[0] = result[0].map(member => {
      member.member = bitToStringArray(member.member);
      member.role = bitToStringArray(member.role);
      member.proceeding = bitToStringArray(member.proceeding);
      member.decision = bitToStringArray(member.decision);
      member.activity = bitToStringArray(member.activity);
      member.receipt = bitToStringArray(member.receipt);
      return member;
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
    let member = await db.execute(
      'SELECT *, get_state(document_state) AS document_state\
      FROM member\
      WHERE group_id=? AND member_id=?', [req.permissions.group_id, req.params.member_id]);

    let parent_decision = await db.execute(
      'SELECT *, get_state(document_state) AS document_state\
      FROM decision\
      WHERE group_id=? AND decision_id=?', [req.permissions.group_id, member[0][0].decision_id]);
    member[0][0].parent_decision = parent_decision[0][0];

    let creator = await db.execute(
      'SELECT *, get_state(document_state) AS document_state\
      FROM member\
      WHERE group_id=? AND member_id=?', [req.permissions.group_id, member[0][0].creator_id]);
    member[0][0].creator = creator[0][0];

    let roles = await db.execute(
      'SELECT *, get_state(R.document_state) AS document_state\
      FROM member_role MR\
        LEFT JOIN role R ON R.group_id=MR.group_id AND R.role_id=MR.role_id\
      WHERE MR.group_id=? AND MR.member_id=?', [req.permissions.group_id, req.params.member_id]);
    member[0][0].roles = roles[0].map(role => {
      role.member = bitToStringArray(role.member);
      role.role = bitToStringArray(role.role);
      role.proceeding = bitToStringArray(role.proceeding);
      role.decision = bitToStringArray(role.decision);
      role.activity = bitToStringArray(role.activity);
      role.receipt = bitToStringArray(role.receipt);
      return role;
    });

    res.send(member[0][0]);
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

    let member = await conn.query(
      'SELECT *, hex(user_id) AS user_id\
      FROM member\
      WHERE group_id=? AND member_id=? AND document_state=0 AND next_id=0', [req.permissions.group_id, req.params.member_id]);
    debug(member[0]);

    let member_new_id = await conn.query('SELECT GET_SEQ(?,"member") AS new_id', [req.permissions.group_id]);

    await conn.query(
      'UPDATE member\
      SET user_id=null, next_id=?\
      WHERE group_id=? AND member_id=?', [member_new_id[0][0].new_id, req.permissions.group_id, req.params.member_id]);

    await conn.query(
      'INSERT INTO member\
      (group_id, member_id, decision_id, prev_id, next_id, document_state, creator_id, created_datetime, user_id, image_url, name)\
      VALUES(?,?,?,?,0,2,?,?,unhex(?),?,?)', [
        req.permissions.group_id,
        member_new_id[0][0].new_id,
        member[0][0].decision_id,
        member[0][0].member_id,
        member_id[0][0].member_id,
        new Date().toISOString().substring(0, 19).replace('T', ' '),
        member[0][0].user_id,
        member[0][0].image_url,
        member[0][0].name
      ]);
    await conn.query(
      'INSERT INTO member_role\
      (group_id, member_id, role_id)\
      VALUES(?,?,2)', [
        req.permissions.group_id,
        member_new_id[0][0].new_id
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

    let member_new_id = await conn.query('SELECT GET_SEQ(?,"member") AS new_id', [req.permissions.group_id]);

    await conn.query(
      'INSERT INTO member\
      (group_id,member_id,prev_id,next_id,document_state,creator_id,created_datetime,user_id,image_url,name,decision_id)\
      VALUES(?,?,?,0,?,?,?,null,null,?,?)', [
        req.permissions.group_id,
        member_new_id[0][0].new_id,
        req.body.prev_id,
        req.body.prev_id ? 3 /*UPDATED*/ : 2/*ADDED*/,
        member_id[0][0].member_id,
        new Date().toISOString().substring(0, 19).replace('T', ' '),
        req.body.name,
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

exports.register = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    let member_id = await conn.query(
      'SELECT member_id\
      FROM member\
      WHERE group_id=? AND user_id=UNHEX(?)', [req.permissions.group_id, req.decoded.user_id]);
    debug(member_id[0]);

    if (member_id[0].length == 0) {
      let member_new_id = await conn.query('SELECT GET_SEQ(?,"member") AS new_id', [req.permissions.group_id]);

      await conn.query(
        'INSERT INTO member\
        (group_id, member_id, document_state, creator_id, created_datetime, user_id, image_url, name, prev_id, next_id)\
        VALUES(?,?,0,?,?,unhex(?),?,?,0,0)', [
          req.permissions.group_id,
          member_new_id[0][0].new_id,
          member_new_id[0][0].new_id,
          new Date().toISOString().substring(0, 19).replace('T', ' '),
          req.decoded.user_id,
          decodeURIComponent(req.decoded.image_url),
          decodeURIComponent(req.decoded.name)
        ]);
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
