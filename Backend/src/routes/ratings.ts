import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { upsertRatingSchema } from '../schemas/ratings';
import {
    deleteMyRating,
    getGuesthouseRatings,
    getMyRatings,
    upsertRating,
} from '../controllers/ratingController';

const router = Router();

//Create or update my rating for a guesthouse
router.post('/', verifyToken, validate(upsertRatingSchema), upsertRating);

//All ratings I have given (keep this above any '/:param' route)
router.get('/me', verifyToken, getMyRatings);

//All ratings for one guesthouse (public)
router.get('/guesthouse/:guesthouseId', getGuesthouseRatings);

//Delete my rating for a guesthouse
router.delete('/:guesthouseId', verifyToken, deleteMyRating);

export default router;