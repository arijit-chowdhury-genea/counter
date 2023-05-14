const { CounterModel } = require("../../../../database/models/counter");

function validate_request_body(req, res, next) {

    const counter = new CounterModel(req.body);

    const validation_errors = counter.validate();

    if (validation_errors.length > 0) {

        const error = new Error('Validation failed');
        error.status = 400;
        error.fields = validation_errors;
        throw error;

    }

    req.counter = counter;

    next();

}

async function request_handler (req, res, next) {

    try {

        const { counter } = req;

        await counter.save();

    } catch (error) {
        
    }

}

function configure(router) {
    router.post(
        '/counter',
        validate_request_body,
        request_handler,
    );
}

module.exports = { configure };
