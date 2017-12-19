const express = require('express');
const router = express.Router();
const controller = require('./member.controller');

router.get('/:group_id/', controller.authRead, controller.getAll);
router.get('/:group_id/:member_id', controller.authRead, controller.getByID);
router.put('/:group_id/:member_id', controller.updateByID);

module.exports = router;
