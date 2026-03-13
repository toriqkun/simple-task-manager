import { Router } from 'express';
import taskController from '../controllers/taskController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', taskController.getAll);
router.get('/my-tasks', authMiddleware, taskController.getByUserId);
router.get('/:id', taskController.getById);

router.post('/', authMiddleware, taskController.create);
router.put('/:id', authMiddleware, taskController.update);
router.delete('/:id', authMiddleware, taskController.delete);

export default router;
