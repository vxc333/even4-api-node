import { Pool } from 'pg';
import { Usuario } from '../interfaces';
import database from '../config/database';

export class UsuarioRepository {
  private db: Pool;

  constructor() {
    this.db = database;
  }

  async criar(usuario: Usuario): Promise<Usuario> {
    const { nome, email, senha, telefone } = usuario;
    const query = `
      INSERT INTO usuarios (nome, email, senha, telefone)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const result = await this.db.query(query, [nome, email, senha, telefone]);
    return result.rows[0];
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const query = 'SELECT * FROM usuarios WHERE email = $1';
    const result = await this.db.query(query, [email]);
    return result.rows[0] || null;
  }

  async buscarPorId(id: number): Promise<Usuario | null> {
    const query = 'SELECT * FROM usuarios WHERE id = $1';
    const result = await this.db.query(query, [id]);
    return result.rows[0] || null;
  }

  async atualizar(id: number, usuario: Usuario): Promise<Usuario> {
    const { nome, email, senha, telefone } = usuario;
    const query = `
      UPDATE usuarios 
      SET nome = $1, email = $2, senha = $3, telefone = $4
      WHERE id = $5
      RETURNING id, nome, email, telefone
    `;
    
    const result = await this.db.query(query, [nome, email, senha, telefone, id]);
    return result.rows[0];
  }

  async atualizarParcial(id: number, dados: Partial<Usuario>): Promise<Usuario> {
    const campos = Object.keys(dados)
      .filter(campo => dados[campo as keyof Usuario] !== undefined)
      .map((campo, index) => `${campo} = $${index + 1}`);

    const valores = Object.values(dados).filter(valor => valor !== undefined);
    valores.push(id);

    const query = `
      UPDATE usuarios 
      SET ${campos.join(', ')}
      WHERE id = $${valores.length}
      RETURNING id, nome, email, telefone
    `;
    
    const result = await this.db.query(query, valores);
    return result.rows[0];
  }

  async deletar(id: number): Promise<void> {
    const query = `
      DELETE FROM usuarios
      WHERE id = $1
    `;
    
    await this.db.query(query, [id]);
  }

  async removerParticipacoes(id: number): Promise<void> {
    const query = `
      DELETE FROM participantes
      WHERE usuario_id = $1
    `;
    
    await this.db.query(query, [id]);
  }

  async removerEventosCriados(id: number): Promise<void> {
    // Primeiro remove os participantes dos eventos
    const queryParticipantes = `
      DELETE FROM participantes
      WHERE evento_id IN (
        SELECT id FROM eventos WHERE criador_id = $1
      )
    `;
    await this.db.query(queryParticipantes, [id]);

    // Depois remove os eventos
    const queryEventos = `
      DELETE FROM eventos
      WHERE criador_id = $1
    `;
    await this.db.query(queryEventos, [id]);
  }
} 