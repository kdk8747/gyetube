const express = require('express');
const router = express.Router();
const controller = require('./receipt.controller');

router.get('/:group/', controller.getAll);
router.get('/:group/balance/:year/:month/:day', controller.getBalance);
router.get('/:group/:id', controller.getByID);
router.put('/:group/:id', controller.updateByID);
router.post('/:group/', controller.create);
router.delete('/:group/:id', controller.deleteByID);

module.exports = router;
