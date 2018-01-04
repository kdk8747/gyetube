const express = require('express');
const router = express.Router();
const controller = require('./role.controller');

router.get('/:group_id/',
  controller.authAny, controller.authRead, controller.getAll);
router.get('/:group_id/anyone',
  controller.getAnyone);
router.get('/:group_id/myself',
  controller.checkLogin, controller.getMyself);
router.get('/:group_id/:role_id',
  controller.authAny, controller.authRead, controller.getByID);

router.put('/:group_id/:role_id',
  controller.authAny, controller.authUpdate, controller.updateByID);

router.post('/:group_id/',
  controller.authAny, controller.authCreate, controller.create);

module.exports = router;
