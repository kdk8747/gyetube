const router = require('express').Router();

router.use('/activities', require('./activities'));
router.use('/decisions', require('./decisions'));
router.use('/proceedings', require('./proceedings'));
router.use('/receipts', require('./receipts'));
router.use('/sign-s3', require('./sign-s3'));


module.exports = router;