# DataAging

Sistema de visualização de dados para avaliações de saúde em idosos, desenvolvido como Trabalho de Conclusão de Curso do TADS. O sistema permite o cadastro e acompanhamento de pacientes através de avaliações IVCF-20 (Índice de Vulnerabilidade Clínico-Funcional), FACTF (Functional Assessment of Chronic Illness Therapy - Fatigue) e Atividade Física.

## Tecnologias

- **Backend**: FastAPI (Python), SQLAlchemy, PostgreSQL/SQLite
- **Frontend**: React + TypeScript, Vite, TailwindCSS, Recharts
- **Infraestrutura**: Docker, Docker Compose, Nginx

## Requisitos

### Execução Local

- Python 3.10+
- Node.js 18+
- PostgreSQL 16+

### Execução com Docker

- Docker 20+
- Docker Compose 2+

## Execução Local

### Backend

1. Configure o PostgreSQL e crie o banco de dados
2. Configure a conexão no arquivo `.env` na raiz do projeto ou em `backend/src/config.py`:

```bash
DATABASE_URL=postgresql://usuario:senha@localhost:5432/dataaging
```

3. Execute o backend:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd src
uvicorn main:app --reload --port 8000
```

API disponível em: `http://localhost:8000`
Documentação: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend disponível em: `http://localhost:5173`

## Execução com Docker

### Configuração de Variáveis de Ambiente

1. Copie o arquivo de exemplo de variáveis de ambiente:
```bash
cp .env.example .env
```

2. Edite o arquivo `.env` conforme necessário. As principais variáveis são:
   - `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`: Configurações do banco de dados
   - `DATABASE_URL`: URL completa de conexão com o banco
   - `BACKEND_PORT`: Porta do backend (padrão: 8000)
   - `FRONTEND_PORT`: Porta do frontend (padrão: 5173)
   - `PROXY_PORT`: Porta do proxy Nginx (padrão: 80)
   - `VITE_API_BASE_URL`: URL base da API para o frontend

3. Inicie os serviços:
```bash
docker compose up -d
```

Serviços disponíveis:
- Frontend: `http://localhost`
- Backend API: `http://localhost/api`
- Documentação: `http://localhost/api/docs`
- PostgreSQL: `localhost:55434` (ou a porta configurada em `POSTGRES_PORT`)

Para parar os serviços:
```bash
docker compose down
```

## Estrutura do Projeto

```
DataAging/
├── backend/          # API FastAPI
├── frontend/         # Aplicação React
├── proxy/            # Configuração Nginx
└── docker-compose.yml
```
