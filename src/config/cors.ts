export const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://even4-api.onrender.com', 
        'https://even-4-api.onrender.com',
        'https://even4-api.onrender.com/api-docs',
        'https://even-4-api.onrender.com/api-docs'
      ]
    : process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Origin', 
    'Accept', 
    'X-Requested-With'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 3600
}; 