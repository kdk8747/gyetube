const express = require('express');
const router = express.Router();
const controller = require('./policy.controller');

router.get('/', controller.getAll);
router.get('/:id', controller.getByID);
router.put('/:id', controller.updateByID);
router.post('/', controller.create);
router.delete('/:id', controller.deleteByID);

module.exports = router;