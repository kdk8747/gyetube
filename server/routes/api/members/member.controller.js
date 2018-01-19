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
      "SELECT M.member_id, M.member_log_id, M.modified_datetime, M.image_url, M.name,\
      get_member_state(M.member_state) AS member_state,\
      concat('[\"', group_concat(R.name separator '\", \"'), '\"]') AS roles\
      FROM member M\
      LEFT JOIN member_role MR  ON MR.group_id=M.group_id  AND  MR.member_id=M.member_id\
      LEFT JOIN role R          ON R.group_id=MR.group_id  AND  R.role_id=MR.role_id\
      WHERE M.group_id=?\
      GROUP BY M.member_id", [req.permissions.group_id]);
    result[0] = result[0].map(member => {
      member.roles = JSON.parse(member.roles);
      return member;
    });
    debug(result[0]);
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
    let member = [[{
      member_id: 0,
      member_log_id: 0,
      member_state: 'UNKNOWN_STATE'
    }]];

    let role = [[{
      home: 0,
      member: 0,
      role: 0,
      proceeding: 0,
      decision: 0,
      activity: 0,
      receipt: 0,
    }]];

    if (req.decoded && req.decoded.user_id) {
      let result = await db.execute(
        'SELECT *, get_member_state(member_state) AS member_state\
        FROM member\
        WHERE group_id=? and user_id=unhex(?)', [req.permissions.group_id, req.decoded.user_id]);

      if (result[0][0]) {
        member = result;
        delete member[0][0].user_id;

        role = await db.execute(
          'SELECT\
          bit_or(R.home) AS home,\
          bit_or(R.member) AS member,\
          bit_or(R.role) AS role,\
          bit_or(R.proceeding) AS proceeding,\
          bit_or(R.decision) AS decision,\
          bit_or(R.activity) AS activity,\
          bit_or(R.receipt) AS receipt\
          FROM member M\
          LEFT JOIN member_role MR ON MR.group_id=M.group_id AND MR.member_id=M.member_id\
          LEFT JOIN role R ON R.group_id=MR.group_id AND R.role_id=MR.role_id\
          WHERE M.group_id=? and M.member_id=?', [req.permissions.group_id, member[0][0].member_id]);
      }
    }

    let role_anyone = await db.execute('SELECT home, member, role, proceeding, decision, activity, receipt\
      FROM role WHERE group_id=? AND role_id=1', [req.permissions.group_id]);

    role[0][0].home = bitToStringArray(role[0][0].home | role_anyone[0][0].home);
    role[0][0].member = bitToStringArray(role[0][0].member | role_anyone[0][0].member);
    role[0][0].role = bitToStringArray(role[0][0].role | role_anyone[0][0].role);
    role[0][0].proceeding = bitToStringArray(role[0][0].proceeding | role_anyone[0][0].proceeding);
    role[0][0].decision = bitToStringArray(role[0][0].decision | role_anyone[0][0].decision);
    role[0][0].activity = bitToStringArray(role[0][0].activity | role_anyone[0][0].activity);
    role[0][0].receipt = bitToStringArray(role[0][0].receipt | role_anyone[0][0].receipt);
    member[0][0].role = role[0][0];

    res.setHeader('Cache-Control', 'public, max-age=1');
    res.send(member[0][0]);
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
    let result = await db.execute(
      "SELECT M.member_id, M.member_log_id, M.modified_datetime, M.image_url, M.name,\
      get_member_state(M.member_state) AS member_state,\
      concat('[\"', group_concat(R.name separator '\", \"'), '\"]') AS roles\
      FROM member M\
      LEFT JOIN member_role MR  ON MR.group_id=M.group_id  AND  MR.member_id=M.member_id\
      LEFT JOIN role R          ON R.group_id=MR.group_id  AND  R.role_id=MR.role_id\
      WHERE M.group_id=? AND M.member_id=?\
      GROUP BY M.member_id", [req.permissions.group_id, req.params.member_id]);
    result[0][0].roles = JSON.parse(result[0][0].roles);
    debug(result[0][0]);
    res.send(result[0][0]);
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
}

exports.getByLogID = async (req, res) => {
  try {
    let member_log = await db.execute(
      'SELECT *, ML.creator_id AS creator_id, get_member_state(ML.member_state) AS member_state\
      FROM member_log ML\
      LEFT JOIN member M ON M.group_id=ML.group_id AND M.member_id=ML.member_id\
      WHERE ML.group_id=? AND ML.member_log_id=?', [req.permissions.group_id, req.params.member_log_id]);
    delete member_log[0][0].user_id;
    delete member_log[0][0].modified_datetime;

    let prev_id = await db.execute(
      'SELECT max(member_log_id) AS prev_id\
      FROM member_log\
      WHERE group_id=? AND member_id=? AND member_log_id<?', [
        req.permissions.group_id,
        member_log[0][0].member_id,
        req.params.member_log_id
      ]);
    member_log[0][0].prev_id = prev_id[0][0].prev_id;

    let next_id = await db.execute(
      'SELECT min(member_log_id) AS next_id\
      FROM member_log\
      WHERE group_id=? AND member_id=? AND member_log_id>?', [
        req.permissions.group_id,
        member_log[0][0].member_id,
        req.params.member_log_id
      ]);
    member_log[0][0].next_id = next_id[0][0].next_id;

    let parent_decision = await db.execute(
      'SELECT *, get_state(document_state) AS document_state\
      FROM decision\
      WHERE group_id=? AND decision_id=?', [req.permissions.group_id, member_log[0][0].decision_id]);
    member_log[0][0].parent_decision = parent_decision[0][0];

    let creator = await db.execute(
      'SELECT *\
      FROM member\
      WHERE group_id=? AND member_id=?', [req.permissions.group_id, member_log[0][0].creator_id]);
    delete creator[0][0].user_id;
    member_log[0][0].creator = creator[0][0];

    let roles = await db.execute(
      'SELECT *, get_state(RL.document_state) AS document_state\
      FROM member_role_log MRL\
      LEFT JOIN role_log RL ON RL.group_id=MRL.group_id AND RL.role_log_id=MRL.role_log_id\
      WHERE MRL.group_id=? AND MRL.member_log_id=?', [req.permissions.group_id, req.params.member_log_id]);
    member_log[0][0].roles = roles[0].map(role => {
      role.home = bitToStringArray(role.home);
      role.member = bitToStringArray(role.member);
      role.role = bitToStringArray(role.role);
      role.proceeding = bitToStringArray(role.proceeding);
      role.decision = bitToStringArray(role.decision);
      role.activity = bitToStringArray(role.activity);
      role.receipt = bitToStringArray(role.receipt);
      return role;
    });

    if (member_log[0][0].next_id > 0)
      res.setHeader('Cache-Control', 'public, max-age=2592000');
    res.send(member_log[0][0]);
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
}

exports.insertMember = async (conn, member) => {
  await conn.query(
    'INSERT INTO member\
    (group_id, member_id, member_log_id, decision_id, user_id, image_url,  name, member_state, creator_id, modified_datetime)\
    VALUES(?,?,?,?,unhex(?),?, ?,?,?,?)', [
      member.group_id,
      member.member_id,
      member.member_log_id,
      member.parent_decision_id ? member.parent_decision_id : null,
      member.user_id ? member.user_id : null,
      member.image_url ? member.image_url : null,

      member.name,
      member.member_state,
      member.creator_id,
      new Date().toISOString().substring(0, 19).replace('T', ' ')
    ]);

  await conn.query(
    'INSERT INTO member_log\
    (group_id, member_log_id, member_id, decision_id, member_state,  creator_id, created_datetime)\
    VALUES(?,?,?,?,?, ?,?)', [
      member.group_id,
      member.member_log_id,
      member.member_id,
      member.parent_decision_id ? member.parent_decision_id : null,
      member.member_state,

      member.creator_id,
      new Date().toISOString().substring(0, 19).replace('T', ' ')
    ]);

  if (member.role_ids) {
    await Promise.all(
      member.role_ids.map(role_id => conn.query(
        'INSERT INTO member_role (group_id, member_id, role_id) VALUES (?,?,?)', [
          member.group_id,
          member.member_id,
          role_id
        ])),
      member.role_ids.map(role_id => conn.query(
        'INSERT INTO member_role_log (group_id, member_log_id, role_log_id)\
        SELECT R.group_id, ?, RL.role_log_id  FROM role R\
        LEFT JOIN role_log RL ON RL.group_id=R.group_id AND RL.role_id=R.role_id\
        WHERE R.group_id=? AND R.role_id=?\
        ORDER BY RL.role_log_id DESC\
        LIMIT 1', [
          member.member_log_id,
          member.group_id,
          role_id
        ])));
  }
}

exports.updateMember = async (conn, member) => {
  let member_log_new_id = await conn.query('SELECT GET_SEQ(?,"member_log") AS new_id', [member.group_id]);
  member.member_log_id = member_log_new_id[0][0].new_id;

  await conn.query(
    'UPDATE member\
    SET member_log_id=?, decision_id=?, user_id=unhex(?), image_url=?, name=?, member_state=?, creator_id=?, modified_datetime=?\
    WHERE group_id=? AND member_id=?', [
      member.member_log_id,
      member.parent_decision_id ? member.parent_decision_id : null,
      member.user_id ? member.user_id : null,
      member.image_url ? member.image_url : null,
      member.name,
      member.member_state,
      member.creator_id,
      new Date().toISOString().substring(0, 19).replace('T', ' '),

      member.group_id,
      member.member_id
    ]);

  await conn.query(
    'INSERT INTO member_log\
    (group_id, member_log_id, member_id, decision_id, member_state,  creator_id, created_datetime)\
    VALUES(?,?,?,?,?, ?,?)', [
      member.group_id,
      member.member_log_id,
      member.member_id,
      member.parent_decision_id ? member.parent_decision_id : null,
      member.member_state,

      member.creator_id,
      new Date().toISOString().substring(0, 19).replace('T', ' ')
    ]);


  if (member.role_ids) {
    await conn.query(
      'DELETE FROM member_role WHERE group_id=? AND member_id=?', [
        member.group_id,
        member.member_id
      ]);
    await Promise.all(
      member.role_ids.map(role_id => conn.query(
        'INSERT INTO member_role (group_id, member_id, role_id) VALUES (?,?,?)', [
          member.group_id,
          member.member_id,
          role_id
        ])),
      member.role_ids.map(role_id => conn.query(
        'INSERT INTO member_role_log (group_id, member_log_id, role_log_id)\
        SELECT R.group_id, ?, RL.role_log_id  FROM role R\
        LEFT JOIN role_log RL ON RL.group_id=R.group_id AND RL.role_id=R.role_id\
        WHERE R.group_id=? AND R.role_id=?\
        ORDER BY RL.role_log_id DESC\
        LIMIT 1', [
          member.member_log_id,
          member.group_id,
          role_id
        ]))
    );
  }
}

exports.approveNewMember = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    let author = await conn.query(
      'SELECT member_id\
      FROM member\
      WHERE group_id=? AND user_id=UNHEX(?)', [req.permissions.group_id, req.decoded.user_id]);
    debug(author[0]);

    let result = await conn.query(
      'SELECT *, hex(user_id) AS user_id\
      FROM member \
      WHERE group_id=? AND member_id=? AND member_state=0', [req.permissions.group_id, req.params.member_id]);
    debug(result[0]);

    let member = result[0][0];
    member.creator_id = author[0][0].member_id;
    member.role_ids = [2];
    member.member_state = 1; /* JOIN_APPROVED */
    await module.exports.updateMember(conn, member);

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

exports.approveOverwrite = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    if (req.params.prev_id == req.params.member_id) throw 'cannot overwrites itself';

    let author = await conn.query(
      'SELECT member_id\
      FROM member\
      WHERE group_id=? AND user_id=UNHEX(?)', [req.permissions.group_id, req.decoded.user_id]);
    debug(author[0]);

    let prev = await conn.query(
      'SELECT *\
      FROM member\
      WHERE group_id=? AND member_id=?', [req.permissions.group_id, req.params.prev_id]);
    debug(prev[0]);

    let result = await conn.query(
      'SELECT *, hex(user_id) AS user_id\
      FROM member\
      WHERE group_id=? AND member_id=? AND member_state=0', [req.permissions.group_id, req.params.member_id]);
    debug(result[0]);

    await conn.query(
      'DELETE FROM member_log\
      WHERE group_id=? AND member_id=? AND member_state=0', [req.permissions.group_id, req.params.member_id]);
    await conn.query(
      'DELETE FROM member\
      WHERE group_id=? AND member_id=? AND member_state=0', [req.permissions.group_id, req.params.member_id]);

    let member = result[0][0];
    member.member_id = prev[0][0].member_id;
    member.creator_id = prev[0][0].member_id;
    member.role_ids = [];
    await module.exports.updateMember(conn, member);

    member.creator_id = author[0][0].member_id;
    member.member_state = 1; /* JOIN_APPROVED */
    member.role_ids = [2];
    await module.exports.updateMember(conn, member);

    await conn.query(
      'UPDATE proceeding P LEFT JOIN attendee A\
      ON P.group_id=A.group_id AND P.proceeding_id=A.proceeding_id AND P.next_id=0\
      SET P.document_state=0\
      WHERE A.group_id=? AND A.member_id=? AND attendee_state=0', [req.permissions.group_id, req.params.prev_id]);

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

exports.reject = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    let author = await conn.query(
      'SELECT member_id\
      FROM member\
      WHERE group_id=? AND user_id=UNHEX(?)', [req.permissions.group_id, req.decoded.user_id]);
    debug(author[0]);

    let result = await conn.query(
      'SELECT *, hex(user_id) AS user_id\
      FROM member\
      WHERE group_id=? AND member_id=? AND member_state=0', [req.permissions.group_id, req.params.member_id]);
    debug(result[0]);

    let member = result[0][0];
    member.member_state = 2; /* JOIN_REJECTED */
    member.user_id = null;
    member.creator_id = author[0][0].member_id;

    await module.exports.updateMember(conn, member);

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
    let member_log_new_id = await conn.query('SELECT GET_SEQ(?,"member_log") AS new_id', [req.permissions.group_id]);

    let member = req.body;
    member.group_id = req.permissions.group_id;
    member.member_id = member_new_id[0][0].new_id;
    member.member_log_id = member_log_new_id[0][0].new_id;
    member.creator_id = member_id[0][0].member_id;
    member.member_state = 3; /* ADDED */
    await module.exports.insertMember(conn, member);

    await conn.commit();
    conn.release();

    res.send({
      member_id: member.member_id,
      member_log_id: member.member_log_id,
      member_state: 'ADDED',
      creator_id: member.creator_id
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
      let member_log_new_id = await conn.query('SELECT GET_SEQ(?,"member_log") AS new_id', [req.permissions.group_id]);

      let member = req.body;
      member.group_id = req.permissions.group_id;
      member.member_id = member_new_id[0][0].new_id;
      member.role_ids = [];
      member.user_id = req.decoded.user_id;
      member.image_url = decodeURIComponent(req.decoded.image_url);
      member.name = decodeURIComponent(req.decoded.name);
      member.member_log_id = member_log_new_id[0][0].new_id;
      member.creator_id = member_new_id[0][0].new_id;
      member.member_state = 0; /* JOIN_REQUESTED */
      debug(member);
      await module.exports.insertMember(conn, member);
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
