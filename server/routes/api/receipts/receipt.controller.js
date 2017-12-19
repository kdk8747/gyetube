const db = require('../../../database');
const debug = require('debug')('receipt');


exports.getAll = async (req, res) => {
  try {
    let result = await db.execute(
      'SELECT *\
      FROM receipt\
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
    let receipt = await db.execute(
      'SELECT *\
      FROM receipt\
      WHERE group_id=? AND receipt_id=?', [req.params.group_id, req.params.receipt_id]);

    if (receipt[0][0].decision_id != null) {
      let parent_decision = await db.execute(
        'SELECT *\
        FROM decision\
        WHERE group_id=? AND decision_id=?', [req.params.group_id, receipt[0][0].decision_id]);
      receipt[0][0].parent_decision = parent_decision[0][0];
    }

    if (receipt[0][0].activity_id != null) {
      let parent_activity = await db.execute(
        'SELECT *\
        FROM activity\
        WHERE group_id=? AND activity_id=?', [req.params.group_id, receipt[0][0].activity_id]);
      receipt[0][0].parent_activity = parent_activity[0][0];
    }

    let creator = await db.execute(
      'SELECT *\
      FROM member\
      WHERE group_id=? AND member_id=?', [req.params.group_id, receipt[0][0].creator_id]);
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

exports.getBalance = (req, res) => {
  if (req.params.group === 'examplelocalparty') {
    res.json(0);
  }
  else if (req.params.group === 'suwongreenparty') {
    if (req.decoded && req.params.group in req.decoded.permissions.groups)
      res.json(0);
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

exports.updateByID = (req, res) => {
  if (req.params.group === 'examplelocalparty') {
    let i = receipts2.findIndex(item => item.id === +req.params.id);
    receipts2[i] = req.body;
    res.send();
  }
  else if (req.params.group === 'suwongreenparty') {
    if (req.params.group in req.decoded.permissions.groups) {
      let i = receipts.findIndex(item => item.id === +req.params.id);
      receipts[i] = req.body;
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
  let newHero = req.body;
  if (req.params.group === 'examplelocalparty') {
    newHero['id'] = receiptID2++;
    newHero['creator'] = req.decoded.id;
    receipts2.push(newHero);
    res.json(newHero);
  }
  else if (req.params.group === 'suwongreenparty') {
    if (req.params.group in req.decoded.permissions.groups) {
      newHero['id'] = receiptID++;
      newHero['creator'] = req.decoded.id;
      receipts.push(newHero);
      res.json(newHero);
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
    receipts2 = receipts2.filter(h => h.id !== +req.params.id);
    res.send();
  }
  else if (req.params.group === 'suwongreenparty') {
    if (req.params.group in req.decoded.permissions.groups) {
      receipts = receipts.filter(h => h.id !== +req.params.id);
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
