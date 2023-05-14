const { CounterModel } = require("../../../../database/models/counter");

async function request_handler (req, res, next) {

    try {

        const { counter_uuid } = req.params;

        const result = await CounterModel.delete_by_uuid(counter_uuid);

        if (result.is_error) {

            return next(result.error);
    
        }

        return res.status(200).json(result.data);

    } catch (error) {

        next(error);

    }

}

function configure(router) {
    router.delete(
        '/counter/:counter_uuid',
        request_handler,
    );
}

module.exports = { configure };
