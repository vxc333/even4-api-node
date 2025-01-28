import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_u2A8jOhEfLrF@ep-old-glitter-a86pwjol-pooler.eastus2.azure.neon.tech/neondb?sslmode=require'
});

export default pool; 