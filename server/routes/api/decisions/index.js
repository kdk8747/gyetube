const express = require('express');
const router = express.Router();
const controller = require('./decision.controller');

router.get('/:group_id/',
  controller.authAny, controller.authRead, controller.getAll);
router.get('/:group_id/:decision_id',
  controller.authAny, controller.authRead, controller.getByID);

module.exports = router;
