const express = require('express');
const router = express.Router();
const controller = require('./user.controller');


router.get('/auth/naver', controller.authenticateNaver);
router.get('/naver_oauth', controller.callbackByNaver);
router.get('/auth/kakao', controller.authenticateKakao);
router.get('/kakao_oauth', controller.callbackByKakao);
router.get('/auth/facebook', controller.authenticateFacebook);
router.get('/facebook_oauth', controller.callbackByFacebook);

router.get('/', controller.getAll);
router.get('/:id', controller.getByID);
/*router.put('/:id', controller.updateByID);
router.delete('/:id', controller.deleteByID);*/

module.exports = router;