const express = require('express');
const router = express.Router();
const controller = require('./decision.controller');

router.get('/:group_id/', controller.getAll);
router.get('/:group_id/:decision_id', controller.getByID);
router.put('/:group_id/:decision_id', controller.updateByID);

module.exports = router;
