const db = require('../../database');
const debug = require('debug')('group-auth');

module.exports = async (req, res, next) => {
  let permissions_obj = {
    member:0,
    role:0,
    proceeding:0,
    decision:0,
    activity:0,
    receipt:0,
  };

  if (req.decoded && req.decoded.user_id) {
    let result = await db.execute(
      'SELECT R.name, R.modified_datetime, get_state(R.document_state) AS document_state,\
        bit_or(R.member) AS member,\
        bit_or(R.role) AS role,\
        bit_or(R.proceeding) AS proceeding,\
        bit_or(R.decision) AS decision,\
        bit_or(R.activity) AS activity,\
        bit_or(R.receipt) AS receipt\
        FROM member M\
        LEFT JOIN member_role MR ON MR.group_id=M.group_id AND MR.member_id=M.member_id\
        LEFT JOIN role R ON R.group_id=MR.group_id AND R.role_id=MR.role_id\
        WHERE M.group_id=? AND M.user_id=unhex(?)', [req.params.group_id, req.decoded.user_id]);

    permissions_obj = {
      member: result[0][0].member,
      role: result[0][0].role,
      proceeding: result[0][0].proceeding,
      decision: result[0][0].decision,
      activity: result[0][0].activity,
      receipt: result[0][0].receipt
    };
  }

  let result_anyone = await db.execute(
    'SELECT * FROM role WHERE group_id=? AND role_id=1', [req.params.group_id]);

  permissions_obj = {
    group_id: req.params.group_id,
    member: permissions_obj.member | result_anyone[0][0].member,
    role: permissions_obj.role | result_anyone[0][0].role,
    proceeding: permissions_obj.proceeding | result_anyone[0][0].proceeding,
    decision: permissions_obj.decision | result_anyone[0][0].decision,
    activity: permissions_obj.activity | result_anyone[0][0].activity,
    receipt: permissions_obj.receipt | result_anyone[0][0].receipt
  };
  req.permissions = permissions_obj;
  next();
}
