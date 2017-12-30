const express = require('express');
const router = express.Router();
const controller = require('./activity.controller');

router.get('/:group_id/',
  controller.authAny, controller.authRead, controller.getAll);
router.get('/:group_id/:activity_id',
  controller.authAny, controller.authRead, controller.getByID);

router.put('/:group_id/:activity_id',
  controller.authAny, controller.authUpdate, controller.updateByID);

router.post('/:group_id/',
  controller.authAny, controller.authCreate, controller.create);

router.delete('/:group_id/:activity_id',
  controller.authAny, controller.authDelete, controller.deleteByID);

module.exports = router;
