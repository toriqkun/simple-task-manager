import { Router } from 'express';
import taskController from '../controllers/taskController';

const router = Router();

router.post('/', taskController.create);
router.get('/', taskController.getAll);
router.get('/user/:userId', taskController.getByUserId);
router.get('/:id', taskController.getById);
router.put('/:id', taskController.update);
router.delete('/:id', taskController.delete);

export default router;
