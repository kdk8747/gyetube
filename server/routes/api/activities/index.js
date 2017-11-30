const express = require('express');
const router = express.Router();
const controller = require('./activity.controller');

router.get('/:group_id/', controller.getAll);
router.get('/:group_id/:activity_id', controller.getByID);
router.put('/:group_id/:activity_id', controller.updateByID);
router.post('/:group_id/', controller.create);
router.delete('/:group_id/:activity_id', controller.deleteByID);

module.exports = router;
