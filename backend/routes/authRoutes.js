import express from 'express';
const router = express.Router();
import {
  registerUser,
  loginUser,
  getProfile,
} from '../controller/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  validateRegistration,
  validateLogin,
} from '../validator/userValidator.js';

// Routing for authentication
router.post('/register', validateRegistration, registerUser);
router.post('/login', validateLogin, loginUser);

//  profile is protected with token
router.get('/profile', protect, getProfile);

export default router;
