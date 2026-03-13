import { Router } from 'express';
import userController from '../controllers/userController';

const router = Router();

router.post('/', userController.register);
router.post('/login', userController.login);
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

export default router;
