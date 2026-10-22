import { Router } from 'express';
import multer from 'multer';
import { requireAdmin, verifyToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createGuesthouseSchema,
  guesthouseImageSchema,
  updateGuesthouseSchema,
} from '../schemas/guesthouse';
import {
  createGuesthouse,
  deleteGuesthouse,
  getGuesthouse,
  listGuesthouses,
  updateGuesthouse,
  uploadGuesthouseImage,
} from '../controllers/guesthouseController';
import { AppError } from '../utils/AppError';
// Configure multer for image uploads with memory storage and file size limit
const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
      return callback(new AppError(400, 'INVALID_IMAGE', 'Only image files are accepted'));
    }
    callback(null, true);
  },
}).single('image');

const router = Router();
// Route to list all guesthouses, accessible to all users
router.get('/', listGuesthouses);
router.get('/:guesthouseId', getGuesthouse);
router.post('/', verifyToken, requireAdmin, validate(createGuesthouseSchema), createGuesthouse);
router.patch('/:guesthouseId', verifyToken, requireAdmin, validate(updateGuesthouseSchema), updateGuesthouse);
router.delete('/:guesthouseId', verifyToken, requireAdmin, deleteGuesthouse);
router.post(
  '/:guesthouseId/images',
  verifyToken,
  requireAdmin,
  uploadImage,
  validate(guesthouseImageSchema),
  uploadGuesthouseImage,
);

export default router;