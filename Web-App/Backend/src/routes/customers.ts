import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createCustomerSchema, updateCustomerSchema } from '../schemas/customer';
import { createCustomer, getMe, updateMe } from '../controllers/customerController';

const router = Router();

router.post('/', verifyToken, validate(createCustomerSchema), createCustomer);
router.get('/me', verifyToken, getMe);
router.patch('/me', verifyToken, validate(updateCustomerSchema), updateMe);

router.get('/me/favourites', verifyToken, (_req, res) => {
    res.json({ success: true, data: [] });
});

router.put('/me/favourites/:guesthouseId', verifyToken, (_req, res) => {
    res.status(204).send();
});

router.delete('/me/favourites/:guesthouseId', verifyToken, (_req, res) => {
    res.status(204).send();
});

export default router;