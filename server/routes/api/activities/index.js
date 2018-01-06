const express = require('express');
const router = express.Router();
const controller = require('./activity.controller');

router.get('/',
  controller.authRead, controller.getAll);
router.get('/:activity_id',
  controller.authRead, controller.getByID);

router.put('/:activity_id',
  controller.authUpdate, controller.updateByID);

router.post('/',
  controller.authCreate, controller.create);

router.delete('/:activity_id',
  controller.authDelete, controller.deleteByID);

module.exports = router;
