const express = require('express');
const router = express.Router();
const controller = require('./decision.controller');

router.get('/:group/', controller.getAll);
router.get('/:group/:id', controller.getByID);
router.put('/:group/:id', controller.updateByID);

module.exports = router;
