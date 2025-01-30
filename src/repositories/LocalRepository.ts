import { Pool } from 'pg';
import { Local } from '../interfaces';
import database from '../config/database';

export class LocalRepository {
  private db: Pool;

  constructor() {
    this.db = database;
  }

  async criar(local: Local): Promise<Local> {
    const { endereco, latitude, longitude } = local;
    const query = `
      INSERT INTO locais (endereco, latitude, longitude)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const result = await this.db.query(query, [endereco, latitude, longitude]);
    return result.rows[0];
  }

  async listar(): Promise<Local[]> {
    const query = 'SELECT * FROM locais ORDER BY id DESC';
    const result = await this.db.query(query);
    return result.rows;
  }

  async buscarPorId(id: number): Promise<Local | null> {
    const query = 'SELECT * FROM locais WHERE id = $1';
    const result = await this.db.query(query, [id]);
    return result.rows[0] || null;
  }

  async deletar(id: number): Promise<void> {
    const query = 'DELETE FROM locais WHERE id = $1';
    await this.db.query(query, [id]);
  }
} 