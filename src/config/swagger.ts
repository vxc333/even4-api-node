import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Even4 API',
      version: '1.0.0',
      description: 'API para gerenciamento de eventos',
      contact: {
        name: 'Suporte Even4',
        email: 'suporte@even4.com'
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://even4-api.onrender.com' 
          : 'http://localhost:3000',
        description: process.env.NODE_ENV === 'production' 
          ? 'Servidor de Produção' 
          : 'Servidor de Desenvolvimento'
      }
    ],
    components: {
      schemas: {
        Usuario: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nome: { type: 'string' },
            email: { type: 'string' },
            telefone: { type: 'string' }
          }
        },
        UsuarioInput: {
          type: 'object',
          required: ['nome', 'email', 'senha', 'telefone'],
          properties: {
            nome: { type: 'string' },
            email: { type: 'string' },
            senha: { type: 'string' },
            telefone: { type: 'string' }
          }
        },
        Login: {
          type: 'object',
          required: ['email', 'senha'],
          properties: {
            email: { type: 'string' },
            senha: { type: 'string' }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            usuario: {
              $ref: '#/components/schemas/Usuario'
            }
          }
        },
        Evento: {
          type: 'object',
          properties: {
            id: { 
              type: 'integer',
              example: 1
            },
            nome: { 
              type: 'string',
              example: "Evento de Teste"
            },
            data: { 
              type: 'string', 
              format: 'date',
              example: "2025-01-28"
            },
            hora: { 
              type: 'string',
              example: "15:00"
            },
            descricao: { 
              type: 'string',
              example: "Descrição do evento de teste"
            },
            criador_id: { 
              type: 'integer',
              example: 1
            },
            latitude: { 
              type: 'number',
              example: -23.5505
            },
            longitude: { 
              type: 'number',
              example: -46.6333
            },
            endereco: { 
              type: 'string',
              example: "Av Paulista, 1000 - São Paulo"
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Participante: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            usuario_id: { type: 'integer' },
            evento_id: { type: 'integer' },
            status: { 
              type: 'string',
              enum: ['CONFIRMADO', 'PENDENTE', 'RECUSADO']
            },
            nome: { type: 'string' },
            email: { type: 'string' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            erro: { type: 'string' }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }],
    tags: [
      {
        name: 'Autenticação',
        description: 'Endpoints de autenticação'
      },
      {
        name: 'Eventos',
        description: 'Operações com eventos'
      },
      {
        name: 'Participantes',
        description: 'Gerenciamento de participantes'
      }
    ]
  },
  apis: ['./src/routes/*.ts']
};

export const specs = swaggerJsdoc(options); 