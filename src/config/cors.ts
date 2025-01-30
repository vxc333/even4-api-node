export const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? [
        'https://even4-api.onrender.com',
        'https://even-4-api.onrender.com',
        'https://even4-api.onrender.com/api-docs',
        'https://even-4-api.onrender.com/api-docs'
      ]
    : ['http://localhost:3000', 'http://localhost:8080'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}; 