const express = require('express');
const router = express.Router();
const controller = require('./role.controller');

router.get('/:group_id/', controller.getAll);
router.get('/:group_id/:role_id', controller.getByID);
router.put('/:group_id/:role_id', controller.updateByID);

module.exports = router;
