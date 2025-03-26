import { Router } from 'express';
const router = Router();
import { register, login, getProfile, updateProfile , getMe} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/me', protect, getMe);
export default router;