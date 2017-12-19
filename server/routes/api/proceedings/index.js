const express = require('express');
const router = express.Router();
const controller = require('./proceeding.controller');

router.get('/:group_id/', controller.authRead, controller.getAll);
router.get('/:group_id/:proceeding_id', controller.authRead, controller.getByID);
router.put('/:group_id/:proceeding_id', controller.updateByID);
router.post('/:group_id/', controller.create);

module.exports = router;
