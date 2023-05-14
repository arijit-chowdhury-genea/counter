const { Client } = require('pg')

let is_connected_to_db = false;

const RETRY_INTERVAL_IN_MILLISECONDS = 3000;

let client;

async function connect_to_database() {

    try {

        client = new Client(process.env.DATABASE_URL);

        client.on('error', on_client_error);
        
        await client.connect();

        is_connected_to_db = true;

        console.log(`Connected to database`);

    } catch (error) {

        console.error(
            `Error connecting to PostGres database.`,
            error.message,
            `Retrying in ${RETRY_INTERVAL_IN_MILLISECONDS / 1000} seconds.`,
            error.stack,
        );

        await client.end();

        setTimeout(connect_to_database, RETRY_INTERVAL_IN_MILLISECONDS);

        is_connected_to_db = false;

    }

}

async function on_client_error (err) {

    if (err) {

        console.error(
            `PostGres database connection error-ed.`,
            err.message,
            `Retrying in ${RETRY_INTERVAL_IN_MILLISECONDS / 1000} seconds.`,
            err.stack,
        );

        setTimeout(connect_to_database, RETRY_INTERVAL_IN_MILLISECONDS);

        is_connected_to_db = false;

    }

}

module.exports = {
    client,
    connect_to_database,
    is_connected_to_db,
};
