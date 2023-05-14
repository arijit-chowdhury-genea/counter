const { start_app, stop_app } = require('../app');
const run_counter_suite = require('./counter');
const { PORT } = require('./helper');

start_app(PORT)
    .then(async () => {

        await run_counter_suite();

    })
    .then(async () => {

        await stop_app();

    });
