const express = require('express');
const app_router = require('./routes');
const {
    connect_to_database,
    disconnect_from_database,
} = require('./database/connection');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(app_router);

let server;

async function start_app(PORT) {

    return new Promise((resolve, reject) => {

        connect_to_database()
            .then(() => {

                server = app.listen(PORT, () => {

                    console.log(`Listening on PORT ${PORT}`);
                    resolve(app);

                });

            })
            .catch((error) => {

                reject(error);

            });

    });

}

async function stop_app() {

    return new Promise((resolve, reject) => {

        disconnect_from_database()
            .then(() => {

                if (server !== undefined && server.close) {

                    console.log(`Shutting down server`);
                    server.close();
                    resolve();

                }

            });

    });

}

module.exports = { start_app, stop_app };
