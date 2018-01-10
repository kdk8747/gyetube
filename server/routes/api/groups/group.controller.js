const decisionController = require('../decisions/decision.controller');
const memberController = require('../members/member.controller');
const roleController = require('../roles/role.controller');
const db = require('../../../database');
const debug = require('debug')('group');


exports.checkLogin = (req, res, next) => {
  if (req.decoded && req.decoded.user_id)
    next();
  else
    res.status(403).json({
      success: false,
      message: 'permission denied'
    });
}

exports.getAll = async (req, res) => {
  try {
    let group = await db.execute(
      'SELECT *\
      FROM `group` G');

    res.send(group[0]);
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
    let group = await db.execute(
      'SELECT *\
      FROM `group` G\
      WHERE G.group_id=?', [req.params.group_id]);

    res.send(group[0][0]);
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
}

exports.getID = async (req, res) => {
  try {
    let group = await db.execute(
      'SELECT *\
      FROM `group`\
      WHERE url_segment=?', [req.params.url_segment]);

    res.send(group[0][0]);
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
}

exports.updateByID = (req, res) => {
  let i = groups.findIndex(item => item.id === req.params.group);
  groups[i] = req.body;
  res.send();
}

exports.create = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    debug(req.body);
    if (!(req.body.url_segment.length < 32)) throw 'Invalid url';
    if (!(req.body.title.length < 32)) throw 'Invalid title';
    if (!(req.body.description.length < 1024)) throw 'Invalid description';

    let created_datetime = new Date().toISOString().substring(0, 19).replace('T', ' ');

    /* creates a group */
    let group = await conn.query(
      'INSERT INTO `group`\
      (url_segment, title, description, created_datetime)\
      VALUES(?,?,?,?)', [
        req.body.url_segment,
        req.body.title,
        req.body.description,
        created_datetime
      ]);
    let group_id = group[0].insertId;

    /* create sequences */
    let sequences = [
      { name: 'proceeding', default: 0 },
      { name: 'decision', default: 0 },
      { name: 'activity', default: 0 },
      { name: 'receipt', default: 0 },
      { name: 'member', default: 1 },
      { name: 'member_log', default: 1 },
      { name: 'role', default: 3 },
      { name: 'role_log', default: 3 },
      { name: 'home', default: 0 }
    ];
    await Promise.all(sequences.map(sequence =>
      conn.query('INSERT INTO master_seq (group_id, seq_name, id) VALUES(?,?,?)', [group_id, sequence.name, sequence.default])));

    /* creates a member */
    let member_new_id = 1;
    let member = {};
    member.group_id = group_id;
    member.member_id = member_new_id;
    member.member_log_id = member_new_id;
    member.user_id = req.decoded.user_id;
    member.image_url = decodeURIComponent(req.decoded.image_url);
    member.name = decodeURIComponent(req.decoded.name);
    member.document_state = 2; /* ADDED */
    member.creator_id = member_new_id;

    await memberController.insertMember(conn, member);

    /* create roles */
    let roles = [
      { id: 1, name: 'ANYONE', member: 0, role: 0, proceeding: 0, decision: 0, activity: 2, receipt: 2 },
      { id: 2, name: 'MEMBER', member: 0, role: 0, proceeding: 6, decision: 6, activity: 15, receipt: 15 },
      { id: 3, name: 'COMMITEE', member: 7, role: 15, proceeding: 7, decision: 6, activity: 15, receipt: 15 }
    ];
    let role_commitee_idx = 2;

    await Promise.all(
      roles.map(role => {
        role.group_id = group_id;
        role.role_id = role.id;
        role.role_log_id = role.id;
        role.creator_id = member_new_id;
        role.document_state = 4;
        return roleController.insertRole(conn, role);
      })
    );

    /* creates a member_role */
    await conn.query('INSERT INTO member_role (group_id, member_id, role_id) VALUES(?,?,3)', [group_id, member_new_id]);
    await conn.query('INSERT INTO member_role_log (group_id, member_log_id, role_log_id) VALUES(?,?,3)', [group_id, member_new_id]);

    /* creates a home */
    await conn.query(
      'INSERT INTO home\
      (group_id, home_id, creator_id, created_datetime, title, description, url_segment)\
      VALUES(?,GET_SEQ(?,"home"),?,?, ?,?,?)', [
        group_id,
        group_id,
        member_new_id,
        new Date().toISOString().substring(0, 19).replace('T', ' '),
        req.body.title,
        req.body.description,
        req.body.url_segment,
      ]);

    /* creates a user_permission */
    await conn.query(
      'INSERT INTO user_permission\
      (group_id, user_id)\
      VALUES(?,unhex(?))', [
        group_id,
        req.decoded.user_id
      ]);

    await conn.commit();
    conn.release();

    res.send({
      group_id: group_id,
      url_segment: req.body.url_segment,
      title: req.body.title,
      description: req.body.description,
      created_datetime: created_datetime,
      image_url: null
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

exports.deleteByID = (req, res) => {
  groups = groups.filter(h => h.id !== req.params.group);
  res.send();
}
