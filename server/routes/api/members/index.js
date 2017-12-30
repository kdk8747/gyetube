const express = require('express');
const router = express.Router();
const controller = require('./member.controller');

router.get('/:group_id/',
  controller.authRead, controller.getAll);
router.get('/:group_id/myself',
  controller.authRead, controller.getMyself);
router.get('/:group_id/:member_id',
  controller.authRead, controller.getByID);

router.put('/:group_id/:member_id',
  controller.authUpdate, controller.updateByID);

router.post('/:group_id/',
  controller.authCreate, controller.create);

module.exports = router;
