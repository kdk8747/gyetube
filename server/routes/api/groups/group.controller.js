const proceedingController = require('../proceedings/proceeding.controller');
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

    res.setHeader('Cache-Control', 'public, max-age=31557600');
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
    member.member_state = 1; /* JOIN_APPROVED */
    member.creator_id = member_new_id;

    await memberController.insertMember(conn, member);

    /* create roles */
    let roles = [
      { id: 1, name: 'ANYONE', home: 2, member: 0, role: 0, proceeding: 0, decision: 0, activity: 2, receipt: 2 },
      { id: 2, name: 'MEMBER', home: 6, member: 0, role: 0, proceeding: 6, decision: 6, activity: 15, receipt: 15 },
      { id: 3, name: 'COMMITEE', home: 7, member: 7, role: 15, proceeding: 7, decision: 6, activity: 15, receipt: 15 }
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

    /* creates a proceeding */
    let now = new Date();
    let curYear = now.getFullYear();
    let curMonth = now.getMonth();
    let curDate = now.getDate();
    let proceeding = {};
    proceeding.group_id = group_id;
    proceeding.document_state = 4; /* PREDEFINED */
    proceeding.prev_id = 0;
    proceeding.meeting_datetime = created_datetime;
    proceeding.title = '환영합니다.';
    proceeding.description = '회의록 초안을 올리고 회의 참석자들의 확인을 받아 보세요.';
    proceeding.child_decisions = [{
      prev_id: 0,
      expiry_datetime: new Date(curYear, curMonth+1, curDate).toISOString().substring(0, 19).replace('T', ' '),
      title: '구성원을 미리 추가해 보세요.',
      description: '[홈] - [구성원] - [+]에서 구성원을 미리 추가할 수 있습니다.\n\
구성원을 미리 추가하면, 과거의 기록들을 올리는 일에 도움이 됩니다.\n\
추후 해당 사용자가 그룹에 가입을 할 경우, 미리 작성한 구성원과 합체시킬 수 있습니다.\n\
구성원을 미리 추가하고 싶다면 여기에 연결해 주세요.'
    },{
      prev_id: 0,
      expiry_datetime: new Date(curYear, curMonth+1, curDate).toISOString().substring(0, 19).replace('T', ' '),
      title: '지난 활동 기록을 올려 보세요.',
      description: '[활동] - [+]에서 활동 기록을 추가할 수 있습니다.\n적절한 합의 없이 수행된 예전 활동 기록을 올리고 싶다면 여기에 연결해 주세요.'
    },{
      prev_id: 0,
      expiry_datetime: new Date(curYear, curMonth+1, curDate).toISOString().substring(0, 19).replace('T', ' '),
      title: '지난 영수증을 올려 보세요.',
      description: '[영수증] - [+]에서 영수증을 추가할 수 있습니다.\n적절한 합의 없이 집행된 영수증 기록을 올리고 싶다면 여기에 연결해 주세요.'
    }];
    await proceedingController.insertProceeding(conn, proceeding);
    await conn.query('UPDATE decision SET document_state=4 WHERE group_id=? AND proceeding_id=1', [group_id]);

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
