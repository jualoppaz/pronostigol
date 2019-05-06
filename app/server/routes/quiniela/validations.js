var Joi = require("joi");

module.exports = {
    getHistoricalAppearedResults: {
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
    getTeams: {
        query: {
            sort_type: Joi.string().valid(["asc", "desc"])
        }
    },
    getSeasons: {
        query: {
            sort_type: Joi.string().valid(["asc", "desc"])
        }
    },
    getCompetitions: {
        query: {
            sort_type: Joi.string().valid(["asc", "desc"])
        }
    },
    getTickets: {
        query: {
            season: Joi.string(),
            page: Joi.number().min(1),
            per_page: Joi.number().min(1),
            sort_type: Joi.string().valid(["asc", "desc"])
        }
    }
};
