const express = require('express');
const router = express.Router();
const controller = require('./role.controller');

router.get('/:group_id/', controller.authRead, controller.getAll);
router.get('/:group_id/:role_id', controller.authRead, controller.getByID);
router.put('/:group_id/:role_id', controller.updateByID);
router.post('/:group_id/', controller.create);

module.exports = router;
