var Joi = require("joi");

module.exports = {
    getTickets: {
        query: {
            year: Joi.number(),
            raffle: Joi.number().min(1),
            page: Joi.number().min(1),
            per_page: Joi.number().min(1),
            sort_type: Joi.string().valid(["asc", "desc"])
        }
    },
    getOccurrencesByNumber: {
        query: {
            page: Joi.number()
                .min(1)
                .required(),
            per_page: Joi.number()
                .min(1)
                .required(),
            sort_type: Joi.string().valid(["asc", "desc"]),
            sort_property: Joi.string().valid(["number", "occurrences"])
        }
    },
    getOccurrencesBySpecialNumber: {
        query: {
            page: Joi.number()
                .min(1)
                .required(),
            per_page: Joi.number()
                .min(1)
                .required(),
            sort_type: Joi.string().valid(["asc", "desc"]),
            sort_property: Joi.string().valid(["specialNumber", "occurrences"])
        }
    },
    getOccurrencesByResult: {
        query: {
            page: Joi.number()
                .min(1)
                .required(),
            per_page: Joi.number()
                .min(1)
                .required(),
            sort_type: Joi.string().valid(["asc", "desc"]),
            sort_property: Joi.string().valid(["result", "occurrences"])
        }
    },
    getOccurrencesByResultWithSpecialNumber: {
        query: {
            page: Joi.number()
                .min(1)
                .required(),
            per_page: Joi.number()
                .min(1)
                .required(),
            sort_type: Joi.string().valid(["asc", "desc"]),
            sort_property: Joi.string().valid(["result", "occurrences"])
        }
    },
    getLastDateByNumber: {
        query: {
            page: Joi.number()
                .min(1)
                .required(),
            per_page: Joi.number()
                .min(1)
                .required(),
            sort_type: Joi.string().valid(["asc", "desc"]),
            sort_property: Joi.string().valid(["number", "date"])
        }
    },
    getLastDateBySpecialNumber: {
        query: {
            page: Joi.number()
                .min(1)
                .required(),
            per_page: Joi.number()
                .min(1)
                .required(),
            sort_type: Joi.string().valid(["asc", "desc"]),
            sort_property: Joi.string().valid(["specialNumber", "date"])
        }
    }
};
