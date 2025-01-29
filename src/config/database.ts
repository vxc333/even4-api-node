import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Necessário para alguns provedores como Heroku/Render
  }
});

// Teste de conexão
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Erro ao conectar ao banco:', err.stack);
  }
  console.log('Conectado ao banco com sucesso!');
  release();
});

export default pool; 