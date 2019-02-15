var Joi = require("joi");

module.exports = {
    getTickets: {
        query: {
            year: Joi.number(),
            raffle: Joi.number()
                .min(1)
                .allow(""),
            page: Joi.number()
                .min(1)
                .required(),
            per_page: Joi.number()
                .min(1)
                .required(),
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
    getOccurrencesByStar: {
        query: {
            page: Joi.number()
                .min(1)
                .required(),
            per_page: Joi.number()
                .min(1)
                .required(),
            sort_type: Joi.string().valid(["asc", "desc"]),
            sort_property: Joi.string().valid(["star", "occurrences"])
        }
    },
    getOccurrencesByStarsPair: {
        query: {
            page: Joi.number()
                .min(1)
                .required(),
            per_page: Joi.number()
                .min(1)
                .required(),
            sort_type: Joi.string().valid(["asc", "desc"]),
            sort_property: Joi.string().valid(["starsPair", "occurrences"])
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
    getOccurrencesByResultWithStars: {
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
    }
};
