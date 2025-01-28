import { Router, Request, Response } from 'express';

const router = Router();

router.get('/health', (_: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

export default router; 