const express = require('express');
const router = express.Router();
const controller = require('./member.controller');

router.get('/',
  controller.authRead, controller.getAll);
router.get('/:member_id',
  controller.authRead, controller.getByID);

router.put('/:member_id',
  controller.authUpdate, controller.updateByID);

router.post('/',
  controller.authCreate, controller.create);

router.post('/register',
  controller.checkLogin, controller.register);

module.exports = router;
