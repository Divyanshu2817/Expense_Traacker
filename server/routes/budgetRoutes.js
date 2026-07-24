import express from 'express';
import { getBudgets, saveBudget, deleteBudget } from '../controllers/budgetController.js';

const router = express.Router();

router.get('/', getBudgets);
router.post('/', saveBudget);
router.delete('/:id', deleteBudget);

export default router;
