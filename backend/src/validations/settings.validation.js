const Joi = require("joi");

const updateSettings = {
    body:Joi.object({
        reminders:Joi.object({
            remind7Days:Joi.boolean(),
            remind3Days:Joi.boolean(),
            remind1Day: Joi.boolean()
        })

        .min(1)
        .required()
    })
}


module.exports = {
    updateSettings
}