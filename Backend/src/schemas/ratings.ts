import Joi from 'joi';

export const upsertRatingSchema = Joi.object({
    guesthouse_id: Joi.string().trim().required(),
    score: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().trim().max(500).allow('').optional(),
});