const { parse_query, QueryParser } = require('../../helper');

const find_by_uuid_parsed_query = parse_query(__dirname, 'find_by_uuid.sql');

function find_by_uuid_query(counter_uuid, columns_returned = '*') {

    const query_parser = new QueryParser(find_by_uuid_parsed_query);

    query_parser.replace_uuid(1, counter_uuid);

    query_parser.replace_columns(2, columns_returned);

    return query_parser.as_string();

}

module.exports = {
    find_by_uuid_query,
};
