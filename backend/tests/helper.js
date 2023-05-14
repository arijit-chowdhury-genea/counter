const PORT = process.env.PORT || 5001;

async function perform_and_log_test(name, fn) {

    try {

        console.log(`Test: '${name}'`);
        
        await fn();

        console.log(`'${name}' successful.`);

    } catch (error) {
        
        console.error(`'${name}' failed.`, error);

    }

}

module.exports = {
    PORT,
    perform_and_log_test,
};
