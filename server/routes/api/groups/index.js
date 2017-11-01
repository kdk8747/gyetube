const express = require('express');
const router = express.Router();
const controller = require('./group.controller');

router.get('/', controller.getAll);
router.get('/:id', controller.getByID);
router.get('/:id/roles', controller.getRoles);
router.get('/:id/roles/:role', controller.getRole);
router.put('/:id', controller.updateByID);
router.post('/', controller.create);
router.delete('/:id', controller.deleteByID);

module.exports = router;
