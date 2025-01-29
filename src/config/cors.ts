export const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://even-4-api.onrender.com', 'https://even-4-api.onrender.com/api-docs']
    : process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 3600
}; 