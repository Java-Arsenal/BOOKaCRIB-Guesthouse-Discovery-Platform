import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { upsertRatingSchema } from '../schemas/ratings';

const router = Router();

//STUBS: fake data in the final response shape. Real logic comes in Sprints 3 and 4.
const now = () => new Date().toISOString();

//Create or update my rating for a guesthouse
router.post('/', verifyToken, validate(upsertRatingSchema), (req, res) => {
    const { guesthouse_id, score, comment } = req.body;
    res.json({
        success: true,
        data: {
            rating_id: `${req.user!.uid}_${guesthouse_id}`,
            guesthouse_id,
            customer_id: req.user!.uid,
            score,
            comment: comment ?? '',
            created_at: now(),
            updated_at: now(),
        },
    });
});

//All ratings I have given (keep this above any '/:param' route)
router.get('/me', verifyToken, (_req, res) => {
    res.json({ success: true, data: [] });
});

//All ratings for one guesthouse (public)
router.get('/guesthouse/:guesthouseId', (_req, res) => {
    res.json({ success: true, data: [] });
});

//Delete my rating for a guesthouse
router.delete('/:guesthouseId', verifyToken, (_req, res) => {
    res.status(204).send();
});

export default router;