const { parse_query, QueryParser } = require('../../helper');

const parsed_query = parse_query(__dirname, 'insert.sql');

function insert_query(name, end_date, columns_returned = '*') {

    const query_parser = new QueryParser(parsed_query);

    query_parser.replace_var_char(1, name);

    query_parser.replace_timestamp(2, end_date);

    query_parser.replace_columns(3, columns_returned);

    return query_parser.as_string();

}

module.exports = insert_query;
