import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';
import 'dotenv/config';

async function initDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Iniciando configuração do banco de dados...');
    
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf8');
    console.log('Schema SQL carregado');
    
    const seed = readFileSync(join(__dirname, 'seed.sql'), 'utf8');
    console.log('Seed SQL carregado');
    
    console.log('Conectando ao banco...');
    const client = await pool.connect();
    
    console.log('Executando schema...');
    await client.query(schema);
    console.log('Schema executado com sucesso');
    
    console.log('Executando seed...');
    await client.query(seed);
    console.log('Seed executado com sucesso');
    
    console.log('Banco de dados inicializado com sucesso!');
    client.release();
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
  } finally {
    await pool.end();
  }
}

initDatabase(); 