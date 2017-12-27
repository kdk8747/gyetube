const db = require('../../../database');
const debug = require('debug')('member');


exports.authRead = (req, res, next) => {
  const READ = 2;
  if (req.decoded && req.decoded.permissions && req.decoded.permissions.groups
    && (req.decoded.permissions.groups[req.params.group_id].member & READ))
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
      'SELECT M.member_id, M.prev_id, M.next_id, M.modified_datetime, M.image_url, M.name,\
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
      GROUP BY M.member_id', [req.params.group_id]);
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
      WHERE group_id=? AND member_id=?', [req.params.group_id, req.params.member_id]);

    let parent_decision = await db.execute(
      'SELECT *, get_state(document_state) AS document_state\
      FROM decision\
      WHERE group_id=? AND decision_id=?', [req.params.group_id, member[0][0].decision_id]);
    member[0][0].parent_decision = parent_decision[0][0];

    let creator = await db.execute(
      'SELECT *, get_state(document_state) AS document_state\
      FROM member\
      WHERE group_id=? AND member_id=?', [req.params.group_id, member[0][0].creator_id]);
    member[0][0].creator = creator[0][0];

    let roles = await db.execute(
      'SELECT *, get_state(R.document_state) AS document_state\
      FROM member_role MR\
        LEFT JOIN role R ON R.group_id=MR.group_id AND R.role_id=MR.role_id\
      WHERE MR.group_id=? AND MR.member_id=?', [req.params.group_id, req.params.member_id]);
    member[0][0].roles = roles[0];

    res.send(member[0][0]);
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
    let member = await db.execute(
      'SELECT *, get_state(document_state) AS document_state\
      FROM member\
      WHERE group_id=? AND user_id=UNHEX(?)', [req.params.group_id, req.decoded.user_id]);
    res.send(member[0][0]);
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
