const { Router } = require('express');
const add_counter = require('./add-counter');
const list_counters = require('./list-counters');

const router = Router();

add_counter.configure(router);
list_counters.configure(router);

module.exports = router;
