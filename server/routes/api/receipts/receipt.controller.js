const db = require('../../../database');
const debug = require('debug')('receipt');


exports.authCreate = (req, res, next) => {
  const CREATE = 1;
  if (req.permissions.receipt & CREATE)
    next();
  else
    res.status(403).json({
      success: false,
      message: 'permission denied'
    });
}

exports.authRead = (req, res, next) => {
  const READ = 2;
  if (req.permissions.receipt & READ)
    next();
  else
    res.status(403).json({
      success: false,
      message: 'permission denied'
    });
}

exports.authUpdate = (req, res, next) => {
  const UPDATE = 4;
  if (req.permissions.receipt & UPDATE)
    next();
  else
    res.status(403).json({
      success: false,
      message: 'permission denied'
    });
}

exports.authDelete = (req, res, next) => {
  const DELETE = 8;
  if (req.permissions.receipt & DELETE)
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
      'SELECT *\
      FROM receipt\
      WHERE group_id=?', [req.permissions.group_id]);
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
    let receipt = await db.execute(
      'SELECT *\
      FROM receipt\
      WHERE group_id=? AND receipt_id=?', [req.permissions.group_id, req.params.receipt_id]);
    debug(receipt[0]);

    if (receipt[0][0].decision_id != null) {
      let parent_decision = await db.execute(
        'SELECT *\
        FROM decision\
        WHERE group_id=? AND decision_id=?', [req.permissions.group_id, receipt[0][0].decision_id]);
      receipt[0][0].parent_decision = parent_decision[0][0];
    }

    if (receipt[0][0].activity_id != null) {
      let parent_activity = await db.execute(
        'SELECT *\
        FROM activity\
        WHERE group_id=? AND activity_id=?', [req.permissions.group_id, receipt[0][0].activity_id]);
      receipt[0][0].parent_activity = parent_activity[0][0];
    }

    let creator = await db.execute(
      'SELECT *\
      FROM member\
      WHERE group_id=? AND member_id=?', [req.permissions.group_id, receipt[0][0].creator_id]);
    receipt[0][0].creator = creator[0][0];

    res.send(receipt[0][0]);
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
}

exports.getBalance = async (req, res) => {
  try {
    let result = await db.execute(
      'SELECT *\
      FROM receipt\
      WHERE group_id=?', [req.permissions.group_id]);
    res.send(result[0]);
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
}

exports.updateByID = async (req, res) => {
  try {
    let result = await db.execute(
      'SELECT *\
      FROM receipt\
      WHERE group_id=? AND receipt_id=?', [req.permissions.group_id, req.params.receipt_id]);
    res.send(result[0]);
  }
  catch (err) {
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
    if (!req.body.parent_decision_id && !req.body.parent_activity_id) throw 'need at least one parent document';
    if (!req.body.settlement_datetime) throw 'need settlement_datetime';
    if (req.body.difference == undefined) throw 'need difference';

    if (req.body.parent_decision_id) {
      await conn.query(
        'UPDATE decision\
        SET total_difference=total_difference+?\
        WHERE group_id=? AND decision_id=?', [req.body.difference, req.permissions.group_id, req.body.parent_decision_id]);
    }
    if (req.body.parent_activity_id) {
      await conn.query(
        'UPDATE activity\
        SET total_difference=total_difference+?\
        WHERE group_id=? AND activity_id=?', [req.body.difference, req.permissions.group_id, req.body.parent_activity_id]);
      await conn.query(
        'UPDATE decision D\
          INNER JOIN activity A ON D.group_id=A.group_id AND D.decision_id=A.decision_id\
        SET D.total_difference=D.total_difference+?\
        WHERE A.group_id=? AND A.activity_id=?', [req.body.difference, req.permissions.group_id, req.body.parent_activity_id]);
    }

    await conn.query(
      'INSERT INTO receipt (group_id, receipt_id, decision_id, activity_id, creator_id,  modified_datetime, settlement_datetime, title, image_url, difference)\
        VALUES(?,GET_SEQ(?,"receipt"),?,?,?, ?,?,?,?,?)', [
        req.permissions.group_id,
        req.permissions.group_id,
        req.body.parent_decision_id ? req.body.parent_decision_id : null,
        req.body.parent_activity_id ? req.body.parent_activity_id : null,
        member_id[0][0].member_id,
        new Date().toISOString().substring(0, 19).replace('T', ' '),
        new Date(req.body.settlement_datetime).toISOString().substring(0, 19).replace('T', ' '),
        req.body.title,
        req.body.image_url ? req.body.image_url : null,
        req.body.difference,
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

exports.deleteByID = async (req, res) => {
  try {
    let result = await db.execute(
      'DELETE FROM receipt\
      WHERE group_id=? AND receipt_id=?', [req.permissions.group_id, req.params.receipt_id]);
    res.send(result[0]);
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
}
