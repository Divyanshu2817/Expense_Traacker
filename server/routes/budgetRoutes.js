import express from 'express';
import { getBudgets, saveBudget, deleteBudget } from '../controllers/budgetController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All budget routes require a valid JWT
router.use(protect);

router.get('/', getBudgets);
router.post('/', saveBudget);
router.delete('/:id', deleteBudget);

export default router;
