const db = require('../../../database');
const debug = require('debug')('server');


exports.getAll = async (req, res) => {
  try {
    let result = await db.execute(
      'SELECT A.activity_id, A.activity_datetime, A.modified_datetime,\
        A.title, A.description,\
        count(distinct P.member_id) AS participants_count,\
        A.elapsed_time, A.total_difference\
      FROM activity A\
        LEFT JOIN participant P ON P.group_id=A.group_id AND P.activity_id=A.activity_id\
      WHERE A.group_id=?\
      GROUP BY A.activity_id', [req.params.group_id]);
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
      WHERE group_id=? AND activity_id=?', [req.params.group_id, req.params.activity_id]);

    let parent_decision = await db.execute(
      'SELECT *\
      FROM decision\
      WHERE group_id=? AND decision_id=?', [req.params.group_id, activity[0][0].decision_id]);
    activity[0][0].parent_decision = parent_decision[0][0];

    let child_receipts = await db.execute(
      'SELECT *\
      FROM receipt\
      WHERE group_id=? AND activity_id=?', [req.params.group_id, req.params.activity_id]);
    activity[0][0].child_receipts = child_receipts[0];

    let participants = await db.execute(
      'SELECT *\
      FROM participant P\
      LEFT JOIN member M ON M.group_id=P.group_id AND M.member_id=P.member_id\
      WHERE P.group_id=? AND P.activity_id=?', [req.params.group_id, req.params.activity_id]);
    activity[0][0].participants = participants[0];

    let creator = await db.execute(
      'SELECT *\
      FROM member\
      WHERE group_id=? AND member_id=?', [req.params.group_id, activity[0][0].creator_id]);
    activity[0][0].creator = creator[0][0];

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

exports.create = (req, res) => {
  let newActivity = req.body;
  if (req.params.group === 'examplelocalparty') {
    newActivity['id'] = activityID2++;
    newActivity['creator'] = req.decoded.id;
    activities2.push(newActivity);
    res.json(newActivity);
  }
  else if (req.params.group === 'suwongreenparty') {
    if (req.params.group in req.decoded.permissions.groups) {
      newActivity['id'] = activityID++;
      newActivity['creator'] = req.decoded.id;
      activities.push(newActivity);
      res.json(newActivity);
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

exports.deleteByID = (req, res) => {
  if (req.params.group === 'examplelocalparty') {
    activities2 = activities2.filter(h => h.id !== +req.params.id);
    res.send();
  }
  else if (req.params.group === 'suwongreenparty') {
    if (req.params.group in req.decoded.permissions.groups) {
      activities = activities.filter(h => h.id !== +req.params.id);
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
