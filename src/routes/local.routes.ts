import { Router } from 'express';
import { LocalController } from '../controllers/LocalController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const localController = new LocalController();

/**
 * @swagger
 * /api/locais:
 *   post:
 *     summary: Criar novo local
 *     tags: [Locais]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - endereco
 *               - latitude
 *               - longitude
 *             properties:
 *               endereco:
 *                 type: string
 *                 example: "Av Paulista, 1000 - São Paulo"
 *               latitude:
 *                 type: number
 *                 minimum: -90
 *                 maximum: 90
 *                 example: -23.5505
 *               longitude:
 *                 type: number
 *                 minimum: -180
 *                 maximum: 180
 *                 example: -46.6333
 *     responses:
 *       201:
 *         description: Local criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Local'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: "Latitude inválida. Deve ser um número entre -90 e 90"
 *   get:
 *     summary: Listar todos os locais
 *     tags: [Locais]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de locais
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Local'
 */
router.post('/', authMiddleware, localController.criar);
router.get('/', authMiddleware, localController.listar);

/**
 * @swagger
 * /api/locais/{id}:
 *   get:
 *     summary: Buscar local por ID
 *     tags: [Locais]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do local
 *     responses:
 *       200:
 *         description: Local encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Local'
 *       404:
 *         description: Local não encontrado
 *   delete:
 *     summary: Deletar local
 *     tags: [Locais]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do local
 *     responses:
 *       200:
 *         description: Local deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Local deletado com sucesso"
 *       404:
 *         description: Local não encontrado
 */
router.get('/:id', authMiddleware, localController.buscarPorId);
router.delete('/:id', authMiddleware, localController.deletar);

export default router; 