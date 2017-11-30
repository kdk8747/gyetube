const express = require('express');
const router = express.Router();
const controller = require('./group.controller');

router.get('/', controller.getAll);
router.get('/:group', controller.getByID);
router.get('/:group/roles', controller.getRoles);
router.get('/:group/roles/:role', controller.getRole);
router.put('/:group', controller.updateByID);
router.post('/', controller.create);
router.delete('/:group', controller.deleteByID);

module.exports = router;
