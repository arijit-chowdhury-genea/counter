const { Router } = require('express');
const add_counter = require('./add-counter');
const get_counter = require('./get-counter');
const delete_counter = require('./delete-counter');
const list_counters = require('./list-counters');

const router = Router();

add_counter.configure(router);
get_counter.configure(router);
delete_counter.configure(router);
list_counters.configure(router);

module.exports = router;
