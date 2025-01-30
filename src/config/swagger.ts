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
            id: { type: 'integer' },
            nome: { type: 'string' },
            data: { type: 'string', format: 'date' },
            hora: { type: 'string' },
            descricao: { type: 'string' },
            criador_id: { type: 'integer' },
            local_id: { type: 'integer' },
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            endereco: { type: 'string' }
          }
        },
        EventoInput: {
          type: 'object',
          required: ['nome', 'data', 'hora', 'descricao', 'local_id'],
          properties: {
            nome: { type: 'string' },
            data: { type: 'string', format: 'date' },
            hora: { type: 'string' },
            descricao: { type: 'string' },
            local_id: { type: 'integer' }
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
        },
        Local: {
          type: 'object',
          required: ['endereco', 'latitude', 'longitude'],
          properties: {
            id: { 
              type: 'integer',
              example: 1
            },
            endereco: { 
              type: 'string',
              example: "Av Paulista, 1000 - São Paulo"
            },
            latitude: { 
              type: 'number',
              minimum: -90,
              maximum: 90,
              example: -23.5505
            },
            longitude: { 
              type: 'number',
              minimum: -180,
              maximum: 180,
              example: -46.6333
            }
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
      },
      {
        name: 'Locais',
        description: 'Operações com locais'
      }
    ]
  },
  apis: ['./src/routes/*.ts']
};

export const specs = swaggerJsdoc(options); 