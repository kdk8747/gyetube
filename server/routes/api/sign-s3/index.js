const express = require('express');
const router = express.Router();
const controller = require('./signs3.controller');

router.get('/:group/:category(receipts|documents|photos)', controller.getSign);

module.exports = router;