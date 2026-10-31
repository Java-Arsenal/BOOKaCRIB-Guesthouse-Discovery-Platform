import { Router } from 'express';
import { verifyToken, requireAdmin, requireActiveCustomer } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createCustomerSchema, updateCustomerSchema, customerStatusSchema } from '../schemas/customer';
import {
    addFavourite,
    createCustomer,
    deleteCustomer,
    getFavourites,
    getMe,
    listCustomers,
    removeFavourite,
    setCustomerStatus,
    updateMe,
} from '../controllers/customerController';

const router = Router();

router.post('/', verifyToken, validate(createCustomerSchema), createCustomer);
router.get('/me', verifyToken, requireActiveCustomer, getMe);
router.patch('/me', verifyToken, requireActiveCustomer, validate(updateCustomerSchema), updateMe);

// Favourites belong to the authenticated customer profile; callers cannot select another customer.
router.get('/me/favourites', verifyToken, requireActiveCustomer, getFavourites);
router.put('/me/favourites/:guesthouseId', verifyToken, requireActiveCustomer, addFavourite);
router.delete('/me/favourites/:guesthouseId', verifyToken, requireActiveCustomer, removeFavourite);

// Admin-only: managing mobile-app customer accounts
router.get('/', verifyToken, requireAdmin, listCustomers);
router.patch('/:customerId/status', verifyToken, requireAdmin, validate(customerStatusSchema), setCustomerStatus);
router.delete('/:customerId', verifyToken, requireAdmin, deleteCustomer);

export default router;
