import { Router } from 'express';
import { EventoController } from '../controllers/EventoController';

const router = Router();
const eventoController = new EventoController();

/**
 * @swagger
 * /api/eventos:
 *   post:
 *     summary: Criar novo evento
 *     tags: [Eventos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - data
 *               - hora
 *               - descricao
 *               - local_id
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Evento de Teste"
 *               data:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-28"
 *               hora:
 *                 type: string
 *                 pattern: "^([0-1][0-9]|2[0-3]):[0-5][0-9]$"
 *                 example: "15:00"
 *               descricao:
 *                 type: string
 *                 example: "Descrição do evento de teste"
 *               local_id:
 *                 type: integer
 *                 minimum: 1
 *                 example: 1
 *     responses:
 *       201:
 *         description: Evento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evento'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   get:
 *     summary: Listar todos os eventos do usuário
 *     tags: [Eventos]
 *     responses:
 *       200:
 *         description: Lista de eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evento'
 */
router.post('/', eventoController.criar);
router.get('/', eventoController.listarEventos);

/**
 * @swagger
 * /api/eventos/passados:
 *   get:
 *     summary: Listar eventos passados
 *     tags: [Eventos]
 *     responses:
 *       200:
 *         description: Lista de eventos passados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evento'
 */
router.get('/passados', eventoController.listarEventosPassados);

/**
 * @swagger
 * /api/eventos/futuros:
 *   get:
 *     summary: Listar eventos futuros
 *     tags: [Eventos]
 *     responses:
 *       200:
 *         description: Lista de eventos futuros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evento'
 */
router.get('/futuros', eventoController.listarEventosFuturos);

/**
 * @swagger
 * /api/eventos/{id}/participantes:
 *   post:
 *     summary: Adicionar participante ao evento
 *     tags: [Participantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_id
 *             properties:
 *               usuario_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Participante adicionado com sucesso
 *   get:
 *     summary: Listar participantes do evento
 *     tags: [Participantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de participantes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Participante'
 */
router.post('/:id/participantes', eventoController.adicionarParticipante);
router.get('/:id/participantes', eventoController.listarParticipantes);

/**
 * @swagger
 * /api/eventos/{id}/participantes/status:
 *   put:
 *     summary: Atualizar status do participante
 *     tags: [Participantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [CONFIRMADO, RECUSADO]
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 */
router.put('/:id/participantes/status', eventoController.atualizarStatusParticipante);

// Novo endpoint para dashboard de participantes
router.get('/:id/participantes/dashboard', eventoController.getDashboardParticipantes);

/**
 * @swagger
 * /api/eventos/{id}:
 *   delete:
 *     summary: Deletar evento
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Evento deletado com sucesso
 *       403:
 *         description: Não autorizado
 *       404:
 *         description: Evento não encontrado
 */
router.delete('/:id', eventoController.deletarEvento);

/**
 * @swagger
 * /api/eventos/{id}/participantes/{participanteId}:
 *   delete:
 *     summary: Remover participante do evento
 *     tags: [Participantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: participanteId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Participante removido com sucesso
 *       403:
 *         description: Não autorizado
 *       404:
 *         description: Evento não encontrado
 */
router.delete('/:id/participantes/:participanteId', eventoController.removerParticipante);

export default router; 