const express = require('express');
const router = express.Router();
const controller = require('./receipt.controller');

router.get('/',
  controller.authRead, controller.getAll);
router.get('/balance/:year/:month/:day',
  controller.authRead, controller.getBalance);
router.get('/:receipt_id',
  controller.authRead, controller.getByID);

router.put('/:receipt_id',
  controller.authUpdate, controller.updateByID);

router.post('/',
  controller.authCreate, controller.create);

router.delete('/:receipt_id',
  controller.authDelete, controller.deleteByID);

module.exports = router;
