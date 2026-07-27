import express from 'express';
import {
  getSummary,
  getFinancialHealth,
  getSubscriptionRadar,
  resetSeedData
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All analytics routes require a valid JWT
router.use(protect);

router.get('/summary', getSummary);
router.get('/health', getFinancialHealth);
router.get('/subscriptions', getSubscriptionRadar);
router.post('/reset', resetSeedData);

export default router;
