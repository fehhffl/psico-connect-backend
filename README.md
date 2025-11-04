# PsicoConnect - Backend

API REST desenvolvida em Node.js para o sistema PsicoConnect.

## 📋 Pré-requisitos

- Node.js (v18 ou superior)
- MongoDB (v6 ou superior)
- npm ou yarn

## 🚀 Como rodar o projeto

### 1. Clone o repositório

```bash
git clone [url-do-repositorio]
cd psico-connect-backend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o MongoDB

Certifique-se de que o MongoDB está instalado e rodando:

```bash
# No macOS com Homebrew
brew services start mongodb-community

# No Ubuntu/Debian
sudo systemctl start mongod

# No Windows
# Inicie o MongoDB através do MongoDB Compass ou serviço do Windows
```

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/psicoconnect
JWT_SECRET=mude_isso_em_producao_use_algo_muito_secreto
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 5. Execute o projeto

```bash
npm run dev
```

O servidor estará disponível em: **http://localhost:5000**

## 📦 Scripts disponíveis

- `npm run dev` - Inicia o servidor com nodemon (auto-reload)
- `npm start` - Inicia o servidor em produção
- `npm test` - Executa os testes

## 🛠️ Stack

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação
- **Socket.io** - WebSocket para real-time

## 📁 Estrutura do projeto

```
src/
├── config/         # Configurações (DB, Auth)
├── controllers/    # Lógica de negócio
├── middleware/     # Middlewares (auth, error)
├── models/         # Schemas do MongoDB
├── routes/         # Rotas da API
├── services/       # Serviços (Socket.io)
└── utils/          # Utilitários
```

## 📡 Endpoints principais

### Autenticação
- `POST /api/auth/register` - Cadastro
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário

### Usuários
- `GET /api/users/psychologists` - Listar psicólogos
- `GET /api/users/patients` - Listar pacientes
- `PUT /api/users/profile` - Atualizar perfil

### Notificações
- `GET /api/notifications` - Listar notificações
- `POST /api/notifications` - Criar notificação

## ⚠️ Importante

- O MongoDB deve estar rodando antes de iniciar o servidor
- Use uma JWT_SECRET forte em produção
- As portas padrão são: Backend (5000) e Frontend (3000)

## 🐛 Problemas comuns

**MongoDB não conecta**:
- Verifique se o MongoDB está rodando: `mongosh` ou `mongo`
- Verifique a string de conexão no `.env`

**Porta em uso**:
- Mude a porta no arquivo `.env`
- Ou termine o processo: `lsof -i :5000` e `kill -9 [PID]`

**Erro de dependências**:
- Delete `node_modules` e `package-lock.json`
- Execute `npm install` novamente

---

Desenvolvido com ❤️ por Felipe Forioni