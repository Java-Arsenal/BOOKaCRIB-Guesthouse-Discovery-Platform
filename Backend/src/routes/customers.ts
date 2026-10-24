import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createCustomerSchema, updateCustomerSchema } from '../schemas/customer';
import {
    addFavourite,
    createCustomer,
    getFavourites,
    getMe,
    removeFavourite,
    updateMe,
} from '../controllers/customerController';

const router = Router();

router.post('/', verifyToken, validate(createCustomerSchema), createCustomer);
router.get('/me', verifyToken, getMe);
router.patch('/me', verifyToken, validate(updateCustomerSchema), updateMe);

router.get('/me/favourites', verifyToken, getFavourites);
router.put('/me/favourites/:guesthouseId', verifyToken, addFavourite);
router.delete('/me/favourites/:guesthouseId', verifyToken, removeFavourite);

export default router;