const { parse_query, QueryParser } = require('../../helper');

const parsed_query = parse_query(__dirname, 'insert.sql');

function insert_query(name, end_date) {

    const query_parser = new QueryParser(parsed_query);

    query_parser.replace_var_char(1, name);

    query_parser.replace_date_time(2, end_date);

    return query_parser.as_string();

}

module.exports = insert_query;
