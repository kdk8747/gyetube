const express = require('express');
const router = express.Router();
const controller = require('./role.controller');

router.get('/',
  controller.authRead, controller.getAll);
router.get('/myself',
  controller.checkLogin, controller.getMyself);
router.get('/:role_id',
  controller.authRead, controller.getByID);

router.put('/:role_id',
  controller.authUpdate, controller.updateByID);

router.post('/',
  controller.authCreate, controller.create);

module.exports = router;
