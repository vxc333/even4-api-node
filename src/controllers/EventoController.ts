import { Request, Response } from 'express';
import { EventoService } from '../services/EventoService';

export class EventoController {
  private service: EventoService;

  constructor() {
    this.service = new EventoService();
    this.criar = this.criar.bind(this);
    this.listarEventos = this.listarEventos.bind(this);
    this.listarEventosPassados = this.listarEventosPassados.bind(this);
    this.listarEventosFuturos = this.listarEventosFuturos.bind(this);
    this.adicionarParticipante = this.adicionarParticipante.bind(this);
    this.listarParticipantes = this.listarParticipantes.bind(this);
    this.atualizarStatusParticipante = this.atualizarStatusParticipante.bind(this);
    this.getDashboardParticipantes = this.getDashboardParticipantes.bind(this);
    this.deletarEvento = this.deletarEvento.bind(this);
    this.removerParticipante = this.removerParticipante.bind(this);
  }

  async criar(req: Request, res: Response): Promise<Response> {
    try {
      const { nome, data, hora, descricao, latitude, longitude, endereco } = req.body;
      
      // Validações básicas
      if (!nome || !data || !hora || !descricao) {
        return res.status(400).json({ erro: 'Nome, data, hora e descrição são obrigatórios' });
      }

      // Validar formato da data
      const dataEvento = new Date(data);
      if (isNaN(dataEvento.getTime())) {
        return res.status(400).json({ erro: 'Data inválida' });
      }

      // Validar formato da hora (HH:mm)
      if (!/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(hora)) {
        return res.status(400).json({ erro: 'Hora inválida' });
      }

      // Validar latitude e longitude se fornecidos
      if (latitude !== undefined) {
        if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
          return res.status(400).json({ 
            erro: 'Latitude inválida. Deve ser um número entre -90 e 90' 
          });
        }
      }

      if (longitude !== undefined) {
        if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
          return res.status(400).json({ 
            erro: 'Longitude inválida. Deve ser um número entre -180 e 180' 
          });
        }
      }

      const evento = await this.service.criarEvento({
        nome,
        data: dataEvento,
        hora,
        descricao,
        criador_id: req.userId!,
        latitude: latitude || null,
        longitude: longitude || null,
        endereco: endereco || null
      });

      return res.status(201).json(evento);
    } catch (error) {
      return res.status(400).json({ 
        erro: error instanceof Error ? error.message : 'Erro ao criar evento' 
      });
    }
  }

  async listarEventos(req: Request, res: Response): Promise<Response> {
    try {
      const eventos = await this.service.listarEventos(req.userId!);
      return res.json(eventos);
    } catch (error) {
      return res.status(400).json({ 
        erro: error instanceof Error ? error.message : 'Erro ao listar eventos' 
      });
    }
  }

  async listarEventosPassados(req: Request, res: Response): Promise<Response> {
    try {
      const eventos = await this.service.listarEventosPassados(req.userId!);
      return res.json(eventos);
    } catch (error) {
      return res.status(400).json({ 
        erro: error instanceof Error ? error.message : 'Erro ao listar eventos passados' 
      });
    }
  }

  async listarEventosFuturos(req: Request, res: Response): Promise<Response> {
    try {
      const eventos = await this.service.listarEventosFuturos(req.userId!);
      return res.json(eventos);
    } catch (error) {
      return res.status(400).json({ 
        erro: error instanceof Error ? error.message : 'Erro ao listar eventos futuros' 
      });
    }
  }

  async adicionarParticipante(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { usuario_id } = req.body;
      
      // Verifica se o evento existe
      const evento = await this.service.buscarPorId(Number(id));
      if (!evento) {
        return res.status(404).json({ erro: 'Evento não encontrado' });
      }

      // Verifica se o usuário já é participante
      const participantes = await this.service.listarParticipantes(Number(id));
      const jaParticipante = participantes.some(p => p.usuario_id === usuario_id);
      
      if (jaParticipante) {
        return res.status(400).json({ erro: 'Usuário já é participante deste evento' });
      }

      await this.service.adicionarParticipante(Number(id), usuario_id);
      return res.status(201).json({ mensagem: 'Participante adicionado com sucesso' });
    } catch (error) {
      return res.status(400).json({ 
        erro: error instanceof Error ? error.message : 'Erro ao adicionar participante' 
      });
    }
  }

  async listarParticipantes(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      // Verifica se o evento existe
      const evento = await this.service.buscarPorId(Number(id));
      if (!evento) {
        return res.status(404).json({ erro: 'Evento não encontrado' });
      }

      const participantes = await this.service.listarParticipantes(Number(id));
      return res.json(participantes);
    } catch (error) {
      return res.status(400).json({ 
        erro: error instanceof Error ? error.message : 'Erro ao listar participantes' 
      });
    }
  }

  async getDashboardParticipantes(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const dashboard = await this.service.getDashboardParticipantes(Number(id));
      return res.json(dashboard);
    } catch (error) {
      return res.status(400).json({ 
        erro: error instanceof Error ? error.message : 'Erro ao buscar dashboard' 
      });
    }
  }

  async atualizarStatusParticipante(req: Request, res: Response): Promise<Response> {
    try {
      const { id, userId } = req.params;
      const { status } = req.body;

      if (!['CONFIRMADO', 'RECUSADO', 'PENDENTE'].includes(status)) {
        return res.status(400).json({ erro: 'Status inválido' });
      }

      await this.service.atualizarStatusParticipante(
        Number(id),
        Number(userId),
        status
      );
      
      return res.json({ mensagem: 'Status atualizado com sucesso' });
    } catch (error) {
      return res.status(400).json({ 
        erro: error instanceof Error ? error.message : 'Erro ao atualizar status' 
      });
    }
  }

  async deletarEvento(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const evento = await this.service.buscarPorId(Number(id));

      if (!evento) {
        return res.status(404).json({ erro: 'Evento não encontrado' });
      }

      // Verificar se o usuário é o criador do evento
      if (evento.criador_id !== req.userId) {
        return res.status(403).json({ erro: 'Não autorizado a deletar este evento' });
      }

      await this.service.deletarEvento(Number(id));
      return res.json({ mensagem: 'Evento deletado com sucesso' });
    } catch (error) {
      return res.status(400).json({ 
        erro: error instanceof Error ? error.message : 'Erro ao deletar evento' 
      });
    }
  }

  async removerParticipante(req: Request, res: Response): Promise<Response> {
    try {
      const { id, participanteId } = req.params;
      const evento = await this.service.buscarPorId(Number(id));

      if (!evento) {
        return res.status(404).json({ erro: 'Evento não encontrado' });
      }

      // Verificar se é o próprio participante ou o criador do evento
      if (Number(participanteId) !== req.userId && evento.criador_id !== req.userId) {
        return res.status(403).json({ erro: 'Não autorizado a remover este participante' });
      }

      await this.service.removerParticipante(Number(id), Number(participanteId));
      return res.json({ mensagem: 'Participante removido com sucesso' });
    } catch (error) {
      return res.status(400).json({ 
        erro: error instanceof Error ? error.message : 'Erro ao remover participante' 
      });
    }
  }
} 