function validate_query_params(req, res, next) {
    
}

async function request_handler (req, res, next) {
    try {
        //
        //  Implement
        //
        res.status(200);
    } catch (error) {
        
    }
}

function configure(router) {
    router.get(
        '/counter',
        validate_query_params,
        request_handler,
    );
}

module.exports = { configure };
