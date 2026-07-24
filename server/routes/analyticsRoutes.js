import express from 'express';
import {
  getSummary,
  getFinancialHealth,
  getSubscriptionRadar,
  resetSeedData
} from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/summary', getSummary);
router.get('/health', getFinancialHealth);
router.get('/subscriptions', getSubscriptionRadar);
router.post('/reset', resetSeedData);

export default router;
