const express = require('express');
const router = express.Router();
const controller = require('./member.controller');

router.get('/',
  controller.authRead, controller.getAll);
router.get('/myself',
  controller.getMyself);
router.get('/:member_id',
  controller.authRead, controller.getByID);
router.get('/:member_id/logs/:member_log_id',
  controller.authRead, controller.getByLogID);

router.put('/:member_id',
  controller.authUpdate, controller.update);
router.put('/:member_id/approve-new-member',
  controller.authUpdate, controller.approveNewMember);
router.put('/:member_id/approve-overwrite/:prev_id',
  controller.authUpdate, controller.approveOverwrite);
router.put('/:member_id/reject',
  controller.authUpdate, controller.reject);

router.post('/',
  controller.authCreate, controller.create);

router.post('/register',
  controller.checkLogin, controller.register);

module.exports = router;
