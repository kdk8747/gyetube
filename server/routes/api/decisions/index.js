const express = require('express');
const router = express.Router();
const controller = require('./decision.controller');

router.get('/',
  controller.authRead, controller.getAll);
router.get('/:decision_id',
  controller.authRead, controller.getByID);

module.exports = router;
