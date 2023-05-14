const express = require('express');
const app_router = require('./routes');
const { connect_to_database } = require('./database/connection');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(app_router);

connect_to_database().then();

app.listen(PORT, () => {
    console.log(`Listening at PORT ${PORT}`);
});
