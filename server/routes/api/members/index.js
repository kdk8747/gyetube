const express = require('express');
const router = express.Router();
const controller = require('./member.controller');

router.get('/:group_id/',
  controller.authAny, controller.authRead, controller.getAll);
router.get('/:group_id/myself',
  controller.checkLogin, controller.getMyself);
router.get('/:group_id/:member_id',
  controller.authAny, controller.authRead, controller.getByID);

router.put('/:group_id/:member_id',
  controller.authAny, controller.authUpdate, controller.updateByID);

router.post('/:group_id/',
  controller.authAny, controller.authCreate, controller.create);
router.post('/:group_id/register',
  controller.checkLogin, controller.register);

module.exports = router;
