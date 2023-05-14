const { get_client } = require("../../connection");
const { insert_query } = require("./insert");
const { delete_by_uuid_query } = require("./delete");
const { find_by_uuid_query } = require("./select");

class CounterModel {

    constructor(request_body) {
        this.name = request_body.name;
        this.end_date = request_body.end_date;
    }

    validate() {
        let errors = [];

        validate_habit_name(this.name, errors);

        validate_habit_end_date(this.end_date, errors);

        return errors;
    }

    async save() {

        let response = { is_error: false };

        try {

            const sql_query = insert_query(this.name, this.end_date);

            const result = await get_client().query(sql_query);

            if (result.rows.length === 1) {

                response.is_error = false;
                response.data = result.rows[0];

            } else {

                response.is_error = true;
                const error = new Error(
                    `Unexpected error while inserting record into ` +
                    `the counter table.`
                );
                error.status = 500;
                response.error = error;

            }

        } catch (error) {
            
            response.is_error = true;
            error.status = 500;
            response.is_error = error;

        } finally {

            return response;

        }

    }

}

function validate_habit_name(name, errors) {

    this.MIN_LENGTH = 5;
    this.MAX_LENGTH = 255;
    this.REGEX = /^[\w- ]+$/;

    let name_errors = [];

    if (name === undefined || name === null) {

        name_errors.push(`Property 'name' is required.`);

    } else if (typeof name !== "string") {

        name_errors.push(`Property 'name' should be of type 'string'.`);

    }
    
    if (name.length < this.MIN_LENGTH) {

        name_errors.push(`Property 'name' should have at least ${this.MIN_LENGTH} characters.`);
        
    }
    
    if (name.length > this.MAX_LENGTH) {

        name_errors.push(`Property 'name' cannot have more than ${this.MAX_LENGTH} characters.`);

    }
    
    if (!this.REGEX.test(name)) {

        name_errors.push(`Property 'name' can only contain alphanumeric, ' ' and '-' characters.`);

    }

    if (name_errors.length) {

        errors.push({
            property: 'name',
            errors: name_errors,
        });

    }

};

function validate_habit_end_date(end_date, errors) {

    let end_date_errors = [];

    let date = new Date(end_date);

    if (end_date === undefined || end_date === null) {

        end_date_errors.push(`Property 'end_date' is required.`);

    }

    let milliseconds = date.getTime();

    if (isNaN(milliseconds)) {

        end_date_errors.push(`Property 'end_date' is not a valid ISO date.`);

    } else if (milliseconds < new Date().getTime()) {

        end_date_errors.push(`Property 'end_date' cannot have a past value.`);

    }

    if (end_date_errors.length) {
        
        errors.push({
            property: 'end_date',
            errors: end_date_errors,
        });

    }

};

CounterModel.find_by_uuid = async function(counter_uuid) {

    let response = { is_error: false };

    try {

        const sql_query = find_by_uuid_query(counter_uuid);

        const result = await get_client().query(sql_query);

        if (result.rows.length === 1) {

            response.is_error = false;
            response.data = result.rows[0];

        } else {

            response.is_error = true;
            const error = new Error(
                `Given counter was not found in the database.`
            );
            error.status = 404;
            error.description =
                `Counter with uuid ${counter_uuid} was not found ` +
                `in the database.`;
            response.error = error;

        }

    } catch (error) {
        
        response.is_error = true;
        error.status = 500;
        response.is_error = error;

    } finally {

        return response;

    }

};

CounterModel.delete_by_uuid = async function(counter_uuid) {

    let response = { is_error: false };

    try {

        const sql_query = delete_by_uuid_query(counter_uuid);

        const result = await get_client().query(sql_query);

        if (result.rows.length === 1) {

            response.is_error = false;
            response.data = result.rows[0];

        } else {

            response.is_error = true;
            const error = new Error(
                `Given counter was not found in the database.`
            );
            error.status = 404;
            error.description =
                `Counter with uuid ${counter_uuid} was not found ` +
                `in the database.`;
            response.error = error;

        }

    } catch (error) {
        
        response.is_error = true;
        error.status = 500;
        response.is_error = error;

    } finally {

        return response;

    }

};

module.exports = { CounterModel }
