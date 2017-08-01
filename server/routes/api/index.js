const router = require('express').Router();

router.use('/activities', require('./activities'));
router.use('/policies', require('./policies'));
router.use('/proceedings', require('./proceedings'));
router.use('/receipts', require('./receipts'));
router.use('/sign-s3', require('./sign-s3'));
router.use('/users', require('./users'));


module.exports = router;