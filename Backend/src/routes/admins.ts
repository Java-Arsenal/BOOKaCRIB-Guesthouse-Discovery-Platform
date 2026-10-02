import { Router } from 'express';
import { verifyToken, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createAdminSchema } from '../schemas/admin';
import { createAdmin, getMe, listAdmins } from '../controllers/adminController';

const router = Router();

router.post('/', verifyToken, requireAdmin, validate(createAdminSchema), createAdmin);
router.get('/me', verifyToken, requireAdmin, getMe);
router.get('/', verifyToken, requireAdmin, listAdmins);

export default router;
