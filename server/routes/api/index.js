const router = require('express').Router();

router.use('/activities', require('./activities'));
router.use('/decisions', require('./decisions'));
router.use('/proceedings', require('./proceedings'));
router.use('/receipts', require('./receipts'));
router.use('/sign-s3', require('./sign-s3'));

router.use('/members', require('./members'));
router.use('/roles', require('./roles'));

router.use('/groups', require('./groups'));
router.use('/group-id/:url_segment', require('./groups/group.controller').getID);

module.exports = router;
