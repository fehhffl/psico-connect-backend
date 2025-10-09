import express from 'express';
import {
  getPsychologists,
  getPatients,
  getUserById,
  updateProfile,
  deactivateAccount,
  getSpecialties
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/psychologists', protect, getPsychologists);
router.get('/patients', protect, authorize('psicologo'), getPatients);
router.get('/specialties', getSpecialties);
router.get('/profile', protect, updateProfile);
router.get('/:id', protect, getUserById);
router.put('/profile', protect, updateProfile);
router.delete('/account', protect, deactivateAccount);

export default router;
