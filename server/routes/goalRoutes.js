import express from 'express';
import { getGoals, createGoal, updateGoalProgress, deleteGoal } from '../controllers/goalController.js';

const router = express.Router();

router.get('/', getGoals);
router.post('/', createGoal);
router.put('/:id/progress', updateGoalProgress);
router.delete('/:id', deleteGoal);

export default router;
