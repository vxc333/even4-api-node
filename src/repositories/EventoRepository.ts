import { Pool } from 'pg';
import { Evento, Participante } from '../interfaces';
import database from '../config/database';

export class EventoRepository {
  private db: Pool;

  constructor() {
    this.db = database;
  }

  async criar(evento: Evento): Promise<Evento> {
    const client = await this.db.connect();
    
    try {
      await client.query('BEGIN');
      
      const { nome, data, hora, descricao, criador_id, latitude, longitude, endereco } = evento;
      const queryEvento = `
        INSERT INTO eventos (nome, data, hora, descricao, criador_id, latitude, longitude, endereco)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      
      const resultEvento = await client.query(queryEvento, [
        nome, data, hora, descricao, criador_id, latitude, longitude, endereco
      ]);
      
      // Adiciona o criador como participante confirmado
      const queryParticipante = `
        INSERT INTO participantes (evento_id, usuario_id, status)
        VALUES ($1, $2, 'CONFIRMADO')
      `;
      
      await client.query(queryParticipante, [resultEvento.rows[0].id, criador_id]);
      
      await client.query('COMMIT');
      return resultEvento.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async listarEventos(usuarioId: number): Promise<Evento[]> {
    const query = `
      SELECT e.*
      FROM eventos e
      WHERE e.criador_id = $1 OR EXISTS (
        SELECT 1 FROM participantes p 
        WHERE p.evento_id = e.id AND p.usuario_id = $1
      )
      ORDER BY e.data DESC
    `;
    
    const result = await this.db.query(query, [usuarioId]);
    return result.rows;
  }

  async listarEventosPassados(): Promise<Evento[]> {
    const query = `
      SELECT 
        e.*,
        COUNT(p.id) as total_participantes,
        SUM(CASE WHEN p.status = 'CONFIRMADO' THEN 1 ELSE 0 END) as confirmados
      FROM eventos e
      LEFT JOIN participantes p ON e.id = p.evento_id
      WHERE e.data < CURRENT_DATE
      GROUP BY e.id
      ORDER BY e.data DESC
    `;
    
    const result = await this.db.query(query);
    return result.rows;
  }

  async listarEventosFuturos(): Promise<Evento[]> {
    const query = `
      SELECT 
        e.*,
        COUNT(p.id) as total_participantes,
        SUM(CASE WHEN p.status = 'CONFIRMADO' THEN 1 ELSE 0 END) as confirmados
      FROM eventos e
      LEFT JOIN participantes p ON e.id = p.evento_id
      WHERE e.data >= CURRENT_DATE
      GROUP BY e.id
      ORDER BY e.data ASC
    `;
    
    const result = await this.db.query(query);
    return result.rows;
  }

  async buscarPorId(id: number): Promise<Evento | null> {
    const query = `
      SELECT e.*
      FROM eventos e
      WHERE e.id = $1
    `;
    const result = await this.db.query(query, [id]);
    return result.rows[0] || null;
  }

  async listarParticipantes(eventoId: number): Promise<Participante[]> {
    const query = `
      SELECT p.*, u.nome, u.email
      FROM participantes p
      JOIN usuarios u ON p.usuario_id = u.id
      WHERE p.evento_id = $1
    `;
    
    const result = await this.db.query(query, [eventoId]);
    return result.rows;
  }

  async atualizarStatusParticipante(
    eventoId: number,
    usuarioId: number,
    status: string
  ): Promise<void> {
    const query = `
      UPDATE participantes
      SET status = $3
      WHERE evento_id = $1 AND usuario_id = $2
    `;
    
    await this.db.query(query, [eventoId, usuarioId, status]);
  }

  async adicionarParticipante(eventoId: number, usuarioId: number): Promise<void> {
    const query = `
      INSERT INTO participantes (evento_id, usuario_id, status)
      VALUES ($1, $2, 'PENDENTE')
      ON CONFLICT (evento_id, usuario_id) DO NOTHING
    `;
    
    await this.db.query(query, [eventoId, usuarioId]);
  }

  async deletarEvento(id: number): Promise<void> {
    const query = `
      DELETE FROM eventos
      WHERE id = $1
    `;
    
    await this.db.query(query, [id]);
  }

  async removerParticipante(eventoId: number, participanteId: number): Promise<void> {
    const query = `
      DELETE FROM participantes
      WHERE evento_id = $1 AND usuario_id = $2
    `;
    
    await this.db.query(query, [eventoId, participanteId]);
  }

  async removerTodosParticipantes(eventoId: number): Promise<void> {
    const query = `
      DELETE FROM participantes
      WHERE evento_id = $1
    `;
    
    await this.db.query(query, [eventoId]);
  }
} 