import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import routes from './routes';
import healthRoutes from './routes/health.routes';

const app = express();

// Configuração do CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 3600
};

app.use(cors(corsOptions));
app.use(express.json());

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