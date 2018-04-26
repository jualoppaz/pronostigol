var Joi = require('joi');

module.exports = {
    getTickets: {
        query: {
            year: Joi.number(),
            raffle: Joi.number().min(1),
            page: Joi.number().min(1),
            per_page: Joi.number().min(1),
            sort_type: Joi.string().valid(['asc', 'desc'])
        }
    }
};