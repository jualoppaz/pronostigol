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
    getOccurrencesByReimbursement: {
        query: {
            page: Joi.number()
                .min(1)
                .required(),
            per_page: Joi.number()
                .min(1)
                .required(),
            sort_type: Joi.string().valid(["asc", "desc"]),
            sort_property: Joi.string().valid(["reimbursement", "occurrences"])
        }
    },
    getOccurrencesByResultWithReimbursement: {
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
    getLastDateByReimbursement: {
        query: {
            page: Joi.number()
                .min(1)
                .required(),
            per_page: Joi.number()
                .min(1)
                .required(),
            sort_type: Joi.string().valid(["asc", "desc"]),
            sort_property: Joi.string().valid(["reimbursement", "date"])
        }
    }
};
