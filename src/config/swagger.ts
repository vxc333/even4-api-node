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
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento'
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