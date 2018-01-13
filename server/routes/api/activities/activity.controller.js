const db = require('../../../database');
const debug = require('debug')('group-auth');


exports.authCreate = (req, res, next) => {
  const CREATE = 1;
  if (req.permissions.activity & CREATE)
    next();
  else
    res.status(403).json({
      success: false,
      message: 'permission denied'
    });
}

exports.authRead = (req, res, next) => {
  const READ = 2;
  if (req.permissions.activity & READ)
    next();
  else
    res.status(403).json({
      success: false,
      message: 'permission denied'
    });
}

exports.authUpdate = (req, res, next) => {
  const UPDATE = 4;
  if (req.permissions.activity & UPDATE)
    next();
  else
    res.status(403).json({
      success: false,
      message: 'permission denied'
    });
}

exports.authDelete = (req, res, next) => {
  const DELETE = 8;
  if (req.permissions.activity & DELETE)
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
      'SELECT A.activity_id, A.activity_datetime, A.modified_datetime, A.title, A.description, A.image_urls, A.document_urls,\
        count(distinct P.member_id) AS participants_count,\
        A.elapsed_time, A.total_difference\
      FROM activity A\
        LEFT JOIN participant P ON P.group_id=A.group_id AND P.activity_id=A.activity_id\
      WHERE A.group_id=?\
      GROUP BY A.activity_id', [req.permissions.group_id]);
    result[0] = result[0].map(activity => {
      activity.image_urls = JSON.parse(activity.image_urls);
      activity.document_urls = JSON.parse(activity.document_urls);
      return activity;
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
    let activity = await db.execute(
      'SELECT *\
      FROM activity\
      WHERE group_id=? AND activity_id=?', [req.permissions.group_id, req.params.activity_id]);

    let parent_decision = await db.execute(
      'SELECT *\
      FROM decision\
      WHERE group_id=? AND decision_id=?', [req.permissions.group_id, activity[0][0].decision_id]);
    activity[0][0].parent_decision = parent_decision[0][0];

    let child_receipts = await db.execute(
      'SELECT *\
      FROM receipt\
      WHERE group_id=? AND activity_id=?', [req.permissions.group_id, req.params.activity_id]);
    activity[0][0].child_receipts = child_receipts[0];

    let participants = await db.execute(
      'SELECT *\
      FROM participant P\
      LEFT JOIN member M ON M.group_id=P.group_id AND M.member_id=P.member_id\
      WHERE P.group_id=? AND P.activity_id=?', [req.permissions.group_id, req.params.activity_id]);
    activity[0][0].participants = participants[0];

    let creator = await db.execute(
      'SELECT *\
      FROM member\
      WHERE group_id=? AND member_id=?', [req.permissions.group_id, activity[0][0].creator_id]);
    activity[0][0].creator = creator[0][0];

    activity[0][0].image_urls = JSON.parse(activity[0][0].image_urls);
    activity[0][0].document_urls = JSON.parse(activity[0][0].document_urls);

    res.send(activity[0][0]);
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
}

exports.updateByID = (req, res) => {
  if (req.params.group === 'examplelocalparty') {
    let i = activities2.findIndex(item => item.id === +req.params.id);
    activities2[i] = req.body;
    res.send();
  }
  else if (req.params.group === 'suwongreenparty') {
    if (req.params.group in req.decoded.permissions.groups) {
      let i = activities.findIndex(item => item.id === +req.params.id);
      activities[i] = req.body;
      res.send();
    }
    else
      res.status(401).json({
        success: false,
        message: 'not logged in'
      });
  }
  else
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
      WHERE group_id=? AND user_id=UNHEX(?)', [req.permissions.group_id, req.decoded.user_id]);
    debug(member_id[0]);

    debug(req.body);
    if (!req.body.activity_datetime) throw 'invalid activity_datetime';
    if (!(+req.body.elapsed_time >= 0)) throw 'need elapsed_time';
    if (!(req.body.participant_ids.length > 0)) throw 'need at least one participant';
    if (!req.body.parent_decision_id) throw 'need parent document';

    await conn.query(
      'UPDATE decision\
      SET total_elapsed_time=total_elapsed_time+?*?\
      WHERE group_id=? AND decision_id=?', [req.body.elapsed_time, req.body.participant_ids.length, req.permissions.group_id, req.body.parent_decision_id]);

    let activity_new_id = await conn.query('SELECT GET_SEQ(?,"activity") AS new_id', [req.permissions.group_id]);

    await conn.query(
      'INSERT INTO activity\
      VALUES(?,?,?,?,?,?, ?,?,?,?,?, ?)', [
        req.permissions.group_id,
        activity_new_id[0][0].new_id,
        req.body.parent_decision_id,
        member_id[0][0].member_id,
        new Date().toISOString().substring(0, 19).replace('T', ' '),
        new Date(req.body.activity_datetime).toISOString().substring(0, 19).replace('T', ' '),
        req.body.title,
        req.body.description,
        JSON.stringify(req.body.image_urls ? req.body.image_urls : []),
        JSON.stringify(req.body.document_urls ? req.body.document_urls : []),
        req.body.elapsed_time,
        0 //req.body.total_difference,
      ]);

    await Promise.all(req.body.participant_ids.map(
      participant_id => conn.query(
        'INSERT INTO participant\
        VALUES(?,?,?)', [req.permissions.group_id, activity_new_id[0][0].new_id, participant_id])));

    await conn.commit();
    conn.release();

    res.send({
      activity_id: activity_new_id[0][0].new_id
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
    res.status(404).json({
      success: false,
      message: 'not found'
    });
}
