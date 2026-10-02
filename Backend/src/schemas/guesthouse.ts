import Joi from 'joi';
// Schema for creating a guesthouse
const guesthouseFields = {
  name: Joi.string().min(2).max(120),
  description: Joi.string().min(10).max(5000),
  amenities: Joi.array().items(Joi.string().max(80)).max(50),
  location: Joi.object().unknown(true),
  price_per_night_bwp: Joi.number().positive(),
  city: Joi.string().min(2).max(100),
  country: Joi.string().min(2).max(100),
  contact_details: Joi.object().unknown(true),
};
// Schema for updating a guesthouse (at least one field must be provided)
export const createGuesthouseSchema = Joi.object({
  name: guesthouseFields.name.required(),
  description: guesthouseFields.description.required(),
  amenities: guesthouseFields.amenities.default([]),
  location: guesthouseFields.location.required(),
  price_per_night_bwp: guesthouseFields.price_per_night_bwp.required(),
  city: guesthouseFields.city.required(),
  country: guesthouseFields.country.required(),
  contact_details: guesthouseFields.contact_details.required(),
});

export const updateGuesthouseSchema = Joi.object(guesthouseFields).min(1);

export const guesthouseImageSchema = Joi.object({
  kind: Joi.string().valid('logo', 'gallery').default('gallery'),
});