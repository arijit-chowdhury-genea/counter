const fs = require('fs');
const path = require('path');

function parse_query(...args) {

    return fs.readFileSync(
        path.join(...args),
        "utf-8"
    );

}

class QueryParser {

    constructor(base_query) {
        this.base_query = base_query;
    }

    replace_var_char(pos, str) {
        this.base_query = this.base_query.replace(
            `$${pos}`,
            `'${str}'`,
        );
    }

    replace_date_time(pos, datetime) {
        this.base_query = this.base_query.replace(
            `$${pos}`,
            `'${datetime}'::datetime`,
        )
    }

    as_string() {
        return this.base_query;
    }
    
}

module.exports = { parse_query, QueryParser };
