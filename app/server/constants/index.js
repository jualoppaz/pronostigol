var roles = require("./roles");

module.exports = {
    HTTP: {
        OK: 200,
        CREATED: 201,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        CONFLICT: 409,
        UNPROCESSABLE_ENTITY: 422,
        INTERNAL_SERVER_ERROR: 500
    },
    ROLES: roles
};
