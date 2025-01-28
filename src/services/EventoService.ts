import { Evento, Participante } from '../interfaces';
import { EventoRepository } from '../repositories/EventoRepository';

export class EventoService {
  private repository: EventoRepository;

  constructor() {
    this.repository = new EventoRepository();
  }

  async criarEvento(evento: Evento): Promise<Evento> {
    return this.repository.criar(evento);
  }

  async listarEventos(usuarioId: number): Promise<Evento[]> {
    return this.repository.listarEventos(usuarioId);
  }

  async listarEventosPassados(usuarioId: number): Promise<Evento[]> {
    return this.repository.listarEventosPassados(usuarioId);
  }

  async listarEventosFuturos(usuarioId: number): Promise<Evento[]> {
    return this.repository.listarEventosFuturos(usuarioId);
  }

  async buscarEventoPorId(id: number): Promise<Evento | null> {
    return this.repository.buscarPorId(id);
  }

  async atualizarStatusParticipante(
    eventoId: number,
    usuarioId: number,
    status: 'CONFIRMADO' | 'RECUSADO'
  ): Promise<void> {
    await this.repository.atualizarStatusParticipante(eventoId, usuarioId, status);
  }

  async listarParticipantes(eventoId: number): Promise<Participante[]> {
    return this.repository.listarParticipantes(eventoId);
  }

  async adicionarParticipante(eventoId: number, usuarioId: number): Promise<void> {
    const evento = await this.repository.buscarPorId(eventoId);
    if (!evento) {
      throw new Error('Evento não encontrado');
    }

    await this.repository.adicionarParticipante(eventoId, usuarioId);
  }

  async deletarEvento(id: number): Promise<void> {
    // Primeiro verifica se existem participantes
    const participantes = await this.repository.listarParticipantes(id);
    if (participantes.length > 0) {
      // Remove todos os participantes primeiro
      await this.repository.removerTodosParticipantes(id);
    }
    
    // Depois deleta o evento
    await this.repository.deletarEvento(id);
  }

  async removerParticipante(eventoId: number, participanteId: number): Promise<void> {
    await this.repository.removerParticipante(eventoId, participanteId);
  }

  async getDashboardParticipantes(eventoId: number) {
    const participantes = await this.repository.listarParticipantes(eventoId);
    return {
      total: participantes.length,
      confirmados: participantes.filter(p => p.status === 'CONFIRMADO').length,
      recusados: participantes.filter(p => p.status === 'RECUSADO').length,
      pendentes: participantes.filter(p => p.status === 'PENDENTE').length
    };
  }

  async buscarPorId(id: number) {
    return this.repository.buscarPorId(id);
  }
} 