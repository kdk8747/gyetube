const express = require('express');
const router = express.Router();
const controller = require('./signs3.controller');

router.get('/post/:category(receipt|activity)',
  controller.authCreate, controller.getPostSign);
router.get('/delete/:category(receipt|activity)',
  controller.authCreateOrDelete, controller.getDeleteSign);

module.exports = router;
