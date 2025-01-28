import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';
import database from '../config/database';

async function initDatabase() {
  try {
    console.log('Iniciando configuração do banco de dados...');
    
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf8');
    console.log('Schema SQL carregado');
    
    const seed = readFileSync(join(__dirname, 'seed.sql'), 'utf8');
    console.log('Seed SQL carregado');
    
    console.log('Executando schema...');
    await database.query(schema);
    
    console.log('Executando seed...');
    await database.query(seed);
    
    console.log('Banco de dados inicializado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
  } finally {
    await database.end();
  }
}

initDatabase(); 