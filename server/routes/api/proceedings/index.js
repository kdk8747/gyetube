const express = require('express');
const router = express.Router();
const controller = require('./proceeding.controller');

router.get('/:group/', controller.getAll);
router.get('/:group/:id', controller.getByID);
router.put('/:group/:id', controller.updateByID);
router.post('/:group/', controller.create);

module.exports = router;
