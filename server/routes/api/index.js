const router = require('express').Router();
const group_auth = require('./group-auth');

router.use('/:group_id/activities', group_auth, require('./activities'));
router.use('/:group_id/decisions', group_auth, require('./decisions'));
router.use('/:group_id/proceedings', group_auth, require('./proceedings'));
router.use('/:group_id/receipts', group_auth, require('./receipts'));
router.use('/:group_id/sign-s3', group_auth, require('./sign-s3'));

router.use('/:group_id/members', group_auth, require('./members'));
router.use('/:group_id/roles', group_auth, require('./roles'));

router.use('', require('./groups'));

module.exports = router;
