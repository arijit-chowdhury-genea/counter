const axios = require('axios').default;
const assert = require('node:assert/strict');
const { PORT, perform_and_log_test } = require('./helper');

const axios_instance = axios.create({
    baseURL: `http://localhost:${PORT}`,
    timeout: 15000,
});

const end_date = new Date(new Date().getTime() + 86400000).toISOString();

const counter_data = {
    uuid: null,
    name: 'My Test Suite Counter',
    end_date,
}

async function add_counter_test() {

    const response = await axios_instance.post(
        '/v1/counter',
        counter_data,
    );

    assert.strictEqual(response.status, 201);

    assert.strictEqual(response.data.name, counter_data.name);

    assert.strictEqual(response.data.end_date, counter_data.end_date);

    counter_data.uuid = response.data.uuid;

};

async function delete_counter_test() {

    const response = await axios_instance.delete(
        `/v1/counter/${counter_data.uuid}`,
    );

    assert.strictEqual(response.status, 200);

    assert.strictEqual(response.data.uuid, counter_data.uuid);

}

async function run_counter_suite() {

    console.log(`Running counter test suite`);

    //
    //  Maintain test order
    //

    await perform_and_log_test(
        'ADD COUNTER TEST',
        add_counter_test,
    );

    await perform_and_log_test(
        'DELETE COUNTER TEST',
        delete_counter_test,
    );

}

module.exports = run_counter_suite;
