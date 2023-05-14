const { Client } = require('pg')

let is_connected_to_db = false;

const RETRY_INTERVAL_IN_MILLISECONDS = 3000;
const MAX_RETRY_COUNT = 5;

let client;
let retry_count = 0;

async function connect_to_database() {

    try {

        client = new Client(process.env.DATABASE_URL);

        client.on('error', on_client_error);
        
        await client.connect();

        is_connected_to_db = true;

        retry_count = 0;
        
        console.log(`Connected to database`);

    } catch (error) {

        await on_client_error(error);

    }

}

async function disconnect_from_database() {

    if (client !== undefined) {

        await client.end()
            .then(() => {

                console.log(`Disconnected from database`);

            })
            .catch((error) => {

                console.error(
                    `Error disconnecting from PostGres client.`,
                    error.message,
                );

            })
            .then(() => {

                is_connected_to_db = false;

                retry_count = 0;

            });

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

        await client.end();

        if (retry_count > MAX_RETRY_COUNT) {

            throw err;

        }

        retry_count++;

        setTimeout(connect_to_database, RETRY_INTERVAL_IN_MILLISECONDS);

        is_connected_to_db = false;

    }

}

function get_client() {
    return client;
}

module.exports = {
    get_client,
    is_connected_to_db,
    connect_to_database,
    disconnect_from_database,
};
