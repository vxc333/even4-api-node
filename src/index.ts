import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import routes from './routes';
import healthRoutes from './routes/health.routes';
import { corsOptions } from './config/cors';

const app = express();

// Configuração CORS
app.use(cors(corsOptions));

// Habilitar preflight para todas as rotas
app.options('*', cors(corsOptions));

app.use(express.json());

// Rotas
app.use(healthRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  swaggerOptions: {
    persistAuthorization: true
  }
}));
app.use('/api', routes);

const port = Number(process.env.PORT) || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`Documentação disponível em http://localhost:${port}/api-docs`);
}); 