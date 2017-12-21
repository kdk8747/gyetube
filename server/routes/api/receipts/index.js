const express = require('express');
const router = express.Router();
const controller = require('./receipt.controller');

router.get('/:group_id/',
  controller.authRead, controller.getAll);
router.get('/:group_id/balance/:year/:month/:day',
  controller.authRead, controller.getBalance);
router.get('/:group_id/:receipt_id',
  controller.authRead, controller.getByID);

router.put('/:group_id/:receipt_id',
  controller.authUpdate, controller.updateByID);

router.post('/:group_id/',
  controller.authCreate, controller.create);

router.delete('/:group_id/:receipt_id',
  controller.authDelete, controller.deleteByID);

module.exports = router;
