const express = require('express');
const router = express.Router();
const controller = require('./signs3.controller');

router.get('/post/:category(receipt|activity)',
  controller.authCreate, controller.getPostSign);
router.get('/delete/:category(receipt)',
  controller.authCreateOrDelete, controller.getDeleteSign);
router.get('/delete/:category(activity)',
  controller.authCreateOrDelete, controller.getMultipleDeleteSign);

module.exports = router;
