const Joi = require('joi');

const createShowSchema = Joi.object({
    name: Joi.string().required(),
    start_time: Joi.date().required(),
    total_seats: Joi.number().integer().min(1).required()
});

module.exports = {
    createShowSchema
};
