# Even4 API

API RESTful para gerenciamento de eventos, desenvolvida com Node.js, TypeScript, Express e PostgreSQL.

## 🚀 Funcionalidades

- Autenticação de usuários com JWT
- Gerenciamento de eventos
- Controle de participantes
- Geolocalização de eventos
- Dashboard de participação
- Documentação interativa com Swagger

## 🛠️ Tecnologias

- Node.js
- TypeScript
- Express
- PostgreSQL
- JWT
- Swagger
- Docker

## 📋 Pré-requisitos

- Node.js >= 18
- PostgreSQL
- Docker (opcional)

## 🔧 Instalação e Execução

1. Clone o repositório
2. Instale as dependências com `npm install`
3. Configure as variáveis de ambiente copiando o `.env.example` para `.env`
4. Execute as migrações do banco com `npm run db:init`
5. Para desenvolvimento: `npm run dev`
6. Para produção: `npm run build` e `npm start`
7. Com Docker: `docker-compose up -d`

## 📚 Documentação da API

A documentação completa está disponível através do Swagger UI:

- Local: http://localhost:3000/api-docs
- Produção: https://even4-api.onrender.com/api-docs

## 🔑 Endpoints Principais

### Autenticação
- `POST /api/usuarios/registro` - Criar novo usuário
- `POST /api/usuarios/login` - Autenticar usuário

### Eventos
- `POST /api/eventos` - Criar evento
- `GET /api/eventos` - Listar eventos
- `GET /api/eventos/futuros` - Listar eventos futuros
- `GET /api/eventos/passados` - Listar eventos passados
- `DELETE /api/eventos/:id` - Deletar evento

### Participantes
- `POST /api/eventos/:id/participantes` - Adicionar participante
- `GET /api/eventos/:id/participantes` - Listar participantes
- `PUT /api/eventos/:id/participantes/status` - Atualizar status
- `DELETE /api/eventos/:id/participantes/:participanteId` - Remover participante
- `GET /api/eventos/:id/participantes/dashboard` - Dashboard de participação

## 🔧 Variáveis de Ambiente

```dotenv
NODE_ENV=development
PORT=3000
DATABASE_URL=sua_url_do_banco
JWT_SECRET=sua_chave_secreta
CORS_ORIGIN=http://localhost:3000
```

## 📦 Estrutura do Banco de Dados

### Tabelas Principais:
- usuarios (gerenciamento de usuários)
- eventos (registro de eventos)
- locais (informações de localização)
- participantes (relação usuários-eventos)

## 🚀 Deploy

O projeto está configurado para deploy automático no Render.com através do arquivo `render.yaml`. A cada push na branch main, uma nova versão é implantada automaticamente.

## 👥 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Faça suas alterações
4. Envie um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 📞 Suporte

Para suporte, envie um email para vitor.xavier.dev@gmail.com