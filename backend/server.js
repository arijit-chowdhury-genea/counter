const { start_app } = require('./app');

const PORT = process.env.PORT || 5000;

start_app(PORT)
    .catch((error) => {

        console.error(
            `Error while starting app.`,
            error,
        );

    });
