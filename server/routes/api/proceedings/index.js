const express = require('express');
const router = express.Router();
const controller = require('./proceeding.controller');

router.get('/',
  controller.authRead, controller.getAll);
router.get('/:proceeding_id',
  controller.authRead, controller.getByID);

router.put('/:proceeding_id',
  controller.authUpdate, controller.updateByID);

router.post('/',
  controller.authCreateOrUpdate, controller.create);

module.exports = router;
