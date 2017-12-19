const db = require('../../../database');
const debug = require('debug')('group');

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
      FROM url_segment U\
      WHERE U.url_segment=?', [req.params.url_segment]);

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

exports.create = (req, res) => {
  let newGroup = req.body;

  let found = groups.find(item => item.id === newGroup.group);
  if (found != undefined) {
    res.writeHead(412, { 'Content-Type': 'application/json' })
    res.send();
  }
  groups.push(newGroup);
  res.json(newGroup);
}
exports.deleteByID = (req, res) => {
  groups = groups.filter(h => h.id !== req.params.group);
  res.send();
}
