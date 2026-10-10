import  Joi from 'joi';

export const createCustomerSchema = Joi.object({
    full_name: Joi.string().trim().min(2).max(100).required(),
});

export const updateCustomerSchema = Joi.object({
    full_name: Joi.string().trim().min(2).max(100).required(),
});