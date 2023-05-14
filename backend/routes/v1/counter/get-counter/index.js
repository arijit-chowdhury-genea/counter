const { CounterModel } = require("../../../../database/models/counter");

async function request_handler (req, res, next) {

    try {

        return res.status(200).json(req.counter);

    } catch (error) {
        
        next(error);

    }

}

async function validate_route_params(req, res, next) {

    const { counter_uuid } = req.params;

    const result = await CounterModel.find_by_uuid(counter_uuid);

    if (result.is_error) {

        return next(result.error);

    }

    req.counter = result.data;

    next();

}

function configure(router) {
    router.get(
        '/counter/:counter_uuid',
        validate_route_params,
        request_handler,
    );
}

module.exports = { configure };
