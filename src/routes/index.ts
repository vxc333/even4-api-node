import { Router } from 'express';
import usuarioRoutes from './usuario.routes';
import eventoRoutes from './evento.routes';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use('/usuarios', usuarioRoutes);
router.use('/eventos', authMiddleware, eventoRoutes);

export default router; 