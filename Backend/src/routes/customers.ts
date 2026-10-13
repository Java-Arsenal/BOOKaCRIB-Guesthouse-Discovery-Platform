import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createCustomerSchema, updateCustomerSchema } from '../schemas/customer';

const router = Router();

//STUBS: fake data in the final response shape. Real logic comes in Sprint 2 and 3.
const fakeCustomer = (uid: string, email?: string, fullName = 'Stub Customer') => ({
    customer_id: uid,
    full_name: fullName,
    email: email?? 'stub@example.com',
    favourites: [] as string[],
    created_at: new Date().toISOString(),
});

router.post('/', verifyToken, validate(createCustomerSchema), (req,res) => {
    res.status(201).json({
        success: true,
        data: fakeCustomer(req.user!.uid, req.user!.email, req.body.full_name),
    });
});

router.get('/me', verifyToken, (req, res) => {
    res.json({ success: true, data: fakeCustomer(req.user!.uid, req.user!.email) });
});

router.patch('/me', verifyToken, validate(updateCustomerSchema), (req, res) => {
    res.json({
        success: true,
        data: fakeCustomer(req.user!.uid, req.user!.email, req.body.full_name),
    });
});

router.get('/me/favourites', verifyToken, (_req, res) => {
    res.json({success: true, data: [] });
});

router.put('/me/favourites/:guesthouseId', verifyToken, (_req, res) => {
    res.status(204).send();
});

router.delete('/me/favourites/:guesthouseId', verifyToken, (_req, res) => {
    res.status(204).send();
});

export default router;