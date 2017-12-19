const express = require('express');
const router = express.Router();
const controller = require('./user.controller');
const auth = require('../../../express-middlewares/authentication');


router.get('/auth/naver', controller.authenticateNaver);
router.get('/naver_oauth', controller.callbackByNaver);
router.get('/auth/kakao', controller.authenticateKakao);
router.get('/kakao_oauth', controller.callbackByKakao);
router.get('/auth/facebook', controller.authenticateFacebook);
router.get('/facebook_oauth', controller.callbackByFacebook);

router.get('/', auth, controller.getAll);
router.get('/:id', auth, controller.getByID);
router.put('/:id', auth, controller.updateByID);
router.delete('/:id', auth, controller.deleteByID);

module.exports = router;
