import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import routes from './routes';
import healthRoutes from './routes/health.routes';

const app = express();

// Configuração CORS mais permissiva
app.use(cors({
  origin: true, // Permite todas as origens
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Habilitar preflight para todas as rotas
app.options('*', cors());

app.use(express.json());

// Rotas
app.use(healthRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api', routes);

app.listen(Number(process.env.PORT), '0.0.0.0', () => {
  console.log(`Server running on port ${process.env.PORT}`);
  console.log(`Documentação disponível em http://localhost:${process.env.PORT}/api-docs`);
}); 