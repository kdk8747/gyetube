const express = require('express');
const router = express.Router();
const controller = require('./signs3.controller');

router.get('/:category(receipt|activity)',
  controller.authCreate, controller.getSign);

module.exports = router;
