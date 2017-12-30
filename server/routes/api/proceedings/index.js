const express = require('express');
const router = express.Router();
const controller = require('./proceeding.controller');

router.get('/:group_id/',
  controller.authAny, controller.authRead, controller.getAll);
router.get('/:group_id/:proceeding_id',
  controller.authAny, controller.authRead, controller.getByID);

router.put('/:group_id/:proceeding_id',
  controller.authAny, controller.authUpdate, controller.updateByID);

router.post('/:group_id/',
  controller.authAny, controller.authCreate, controller.create);

module.exports = router;
