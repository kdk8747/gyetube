const db = require('../../../database');
const debug = require('debug')('role');

exports.getAll = async (req, res) => {
  try {
    let result = await db.execute(
      'SELECT *\
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
      'SELECT *\
      FROM role\
      WHERE group_id=? AND role_id=?', [req.params.group_id, req.params.role_id]);

    let parent_decision = await db.execute(
      'SELECT *\
        FROM decision\
        WHERE group_id=? AND decision_id=?', [req.params.group_id, role[0][0].decision_id]);
    role[0][0].parent_decision = parent_decision[0][0];

    let creator = await db.execute(
      'SELECT *\
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
