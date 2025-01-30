import { Router } from 'express';
import usuarioRoutes from './usuario.routes';
import eventoRoutes from './evento.routes';
import localRoutes from './local.routes';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use('/usuarios', usuarioRoutes);
router.use('/eventos', authMiddleware, eventoRoutes);
router.use('/locais', authMiddleware, localRoutes);

export default router; 