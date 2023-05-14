const { Router } = require('express');
const v1_router = require('./v1');

const router = Router();

router.use(v1_router);

module.exports = router;
