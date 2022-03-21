const path = require('path');
const responseCode = require(path.resolve('utils/http.response.code'));
const validator = async(schema, body) => {
    try {
        // if the validation succeded it will return the processed data
        const data = await schema.validateAsync(body);
        // return the data and ok
        return {
            ok: true,
            code: responseCode.HTTP_OK,
            data
        };
    } catch (err) {
        // gets the error message out of the joi error
        const { message } = err.details[0];
        //  respond with error to the client
        return {
            ok: false,
            code: responseCode.HTTP_UNPROCESSABLE_ENTITY,
            error: message
        };
    }
};

module.exports = validator;