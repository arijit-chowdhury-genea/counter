const { Router } = require('express');
const counter_router = require('./counter');

const router = Router();

router.use('/v1', counter_router);

module.exports = router;
