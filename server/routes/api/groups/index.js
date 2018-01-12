const express = require('express');
const router = express.Router();
const controller = require('./group.controller');

router.get('/', controller.getAll);
router.get('/:group_id', controller.getByID);
router.get('/:group_id/id', controller.getID);
router.put('/:group_id', controller.updateByID);
router.post('/', controller.checkLogin, controller.create);
router.delete('/:group_id', controller.deleteByID);

module.exports = router;
