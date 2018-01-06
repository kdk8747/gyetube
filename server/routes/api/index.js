const router = require('express').Router();
const group_auth = require('./group-auth');

router.use('/activities/:group_id', group_auth, require('./activities'));
router.use('/decisions/:group_id', group_auth, require('./decisions'));
router.use('/proceedings/:group_id', group_auth, require('./proceedings'));
router.use('/receipts/:group_id', group_auth, require('./receipts'));
router.use('/sign-s3', require('./sign-s3'));

router.use('/members/:group_id', group_auth, require('./members'));
router.use('/roles/:group_id', group_auth, require('./roles'));

router.use('/groups', require('./groups'));
router.use('/group-id/:url_segment', require('./groups/group.controller').getID);

module.exports = router;
