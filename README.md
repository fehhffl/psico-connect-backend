# PsicoConnect Backend API

Backend API para a plataforma PsicoConnect - Conectando psicólogos estagiários e pacientes.

## 🚀 Tecnologias

- Node.js + Express
- MongoDB + Mongoose
- Socket.io (notificações em tempo real)
- JWT (autenticação)
- Bcrypt (hash de senhas)

## 📋 Pré-requisitos

- Node.js v18+
- MongoDB rodando localmente ou MongoDB Atlas

## 🔧 Instalação

1. Instalar dependências:
```bash
npm install
```

2. Configurar variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/psicoconnect
JWT_SECRET=seu_segredo_aqui
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

3. Iniciar o servidor:

**Desenvolvimento:**
```bash
npm run dev
```

**Produção:**
```bash
npm start
```

## 📡 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Obter dados do usuário logado
- `PUT /api/auth/update-password` - Atualizar senha

### Usuários
- `GET /api/users/psychologists` - Listar psicólogos
- `GET /api/users/patients` - Listar pacientes (apenas psicólogos)
- `GET /api/users/specialties` - Listar especialidades
- `GET /api/users/:id` - Buscar usuário por ID
- `PUT /api/users/profile` - Atualizar perfil
- `DELETE /api/users/account` - Desativar conta

### Notificações
- `POST /api/notifications` - Criar notificação
- `GET /api/notifications` - Listar notificações
- `PUT /api/notifications/:id/read` - Marcar como lida
- `PUT /api/notifications/read-all` - Marcar todas como lidas
- `DELETE /api/notifications/:id` - Deletar notificação

## 🔌 WebSocket Events

### Cliente → Servidor
- `user:online` - Usuário ficou online
- `typing:start` - Começou a digitar
- `typing:stop` - Parou de digitar

### Servidor → Cliente
- `notification` - Nova notificação recebida
- `message` - Nova mensagem recebida
- `user:status` - Status de usuário mudou
- `typing:user` - Usuário está digitando

## 🔒 Autenticação

Todas as rotas protegidas requerem um token JWT no header:

```
Authorization: Bearer SEU_TOKEN_AQUI
```

## 📝 Estrutura do Projeto

```
psico-connect-backend/
├── src/
│   ├── config/          # Configurações (DB, JWT)
│   ├── controllers/     # Controladores das rotas
│   ├── middleware/      # Middlewares (auth, error handler)
│   ├── models/         # Modelos do MongoDB
│   ├── routes/         # Definição das rotas
│   ├── services/       # Serviços (Socket.io)
│   └── utils/          # Utilitários
├── .env                # Variáveis de ambiente
├── .gitignore
├── package.json
└── server.js           # Arquivo principal
```

## 🧪 Testando a API

Você pode usar ferramentas como Postman, Insomnia ou curl para testar os endpoints.

Exemplo de registro:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123",
    "userType": "paciente",
    "phone": "(11) 98888-8888"
  }'
```

## 📄 Licença

ISC
