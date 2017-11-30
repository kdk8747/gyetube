const models = require('../../../models');
const debug = require('debug')('server');


exports.getAll = (req, res) => {
  models.activity.findAll({
    attributes: ['activity_id', 'decision_id', 'creator_id', 'modified_datetime', 'activity_datetime',
      'title', 'description', 'image_urls', 'document_urls', 'elapsed_time', 'total_difference'],
    where: { group_id: req.params.group_id }
  }).then((result) => {
    res.json(result.map(row => {
      return {
        id: row.dataValues.activity_id,
        creator: row.dataValues.creator_id,
        modifiedDate: row.dataValues.modified_datetime,
        activityDate: row.dataValues.activity_datetime,
        title: row.dataValues.title,
        description: row.dataValues.description,
        imageUrls: row.dataValues.image_urls,
        documentUrls: row.dataValues.document_urls,
        elapsedTime: row.dataValues.elapsed_time,
        totalDifference: row.dataValues.total_difference,
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
  models.activity.findOne({
    attributes: ['activity_id', 'decision_id', 'creator_id', 'modified_datetime', 'activity_datetime',
      'title', 'description', 'image_urls', 'document_urls', 'elapsed_time', 'total_difference'],
    where: { group_id: req.params.group_id, activity_id: +req.params.activity_id }
  }).then((result) => {
    res.json({
      id: result.activity_id,
      creator: result.creator_id,
      modifiedDate: result.modified_datetime,
      activityDate: result.activity_datetime,
      title: result.title,
      description: result.description,
      imageUrls: result.image_urls,
      documentUrls: result.document_urls,
      elapsedTime: result.elapsed_time,
      totalDifference: result.total_difference,
      childReceipts: [],//result.decision_id
    });
  }).catch((reason => {
    res.status(400).json({
      success: false,
      message: reason
    });
  }));
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
