const models = require('../../../models');
const debug = require('debug')('server');


exports.getAll = (req, res) => {
  models.receipt.findAll({
    attributes: ['receipt_id', 'activity_id', 'decision_id', 'creator_id', 'modified_datetime', 'settlement_datetime',
      'title', 'image_url', 'difference'],
    where: { group_id: req.params.group_id }
  }).then((result) => {
    res.json(result.map(row => {
      return {
        id: row.dataValues.receipt_id,
        creator: row.dataValues.creator_id,
        modifiedDate: row.dataValues.modified_datetime,
        settlementDate: row.dataValues.settlement_datetime,
        title: row.dataValues.title,
        imageUrl: row.dataValues.image_url,
        difference: row.dataValues.difference,
        childReceipts: [],//row.dataValues.decision_id
      };
    }));
  }).catch((reason => {
    debug(reason);
    res.status(400).json({
      success: false,
      message: reason
    });
  }));
}

exports.getByID = (req, res) => {
  models.receipt.findOne({
    attributes: ['receipt_id', 'activity_id', 'decision_id', 'creator_id', 'modified_datetime', 'settlement_datetime',
      'title', 'image_url', 'difference'],
    where: { group_id: req.params.group_id, receipt_id: +req.params.receipt_id }
  }).then((result) => {
    res.json({
      id: result.receipt_id,
      creator: result.creator_id,
      modifiedDate: result.modified_datetime,
      settlementDate: result.settlement_datetime,
      title: result.title,
      imageUrl: result.image_url,
      difference: result.difference,
      childReceipts: [],//result.decision_id
    });
  }).catch((reason => {
    res.status(400).json({
      success: false,
      message: reason
    });
  }));
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
