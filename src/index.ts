import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import routes from './routes';
import healthRoutes from './routes/health.routes';
import { corsOptions } from './config/cors';

const app = express();

// Habilitar CORS para preflight requests
app.options('*', cors(corsOptions));

// CORS para todas as rotas
app.use(cors(corsOptions));

// Middleware para permitir JSON
app.use(express.json());

// Headers adicionais de segurança
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

// Rotas de health check
app.use(healthRoutes);

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Rotas da API
app.use('/api', routes);

app.listen(Number(process.env.PORT), '0.0.0.0', () => {
  console.log(`Server running on port ${process.env.PORT}`);
  console.log(`Documentação disponível em http://localhost:${process.env.PORT}/api-docs`);
}); 