import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import routes from './routes';
import healthRoutes from './routes/health.routes';
import { corsOptions } from './config/cors';

const app = express();

// Middleware CORS personalizado
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.json());

// Rotas
app.use(healthRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api', routes);

app.listen(Number(process.env.PORT), '0.0.0.0', () => {
  console.log(`Server running on port ${process.env.PORT}`);
  console.log(`Documentação disponível em http://localhost:${process.env.PORT}/api-docs`);
}); 