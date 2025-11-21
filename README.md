# DataAging

Sistema de gerenciamento e visualização de dados para avaliações de saúde em idosos, desenvolvido como Trabalho de Conclusão de Curso do TADS. O sistema permite o cadastro e acompanhamento de pacientes através de avaliações IVCF-20 (Índice de Vulnerabilidade Clínico-Funcional), FACTF (Functional Assessment of Chronic Illness Therapy - Fatigue) e Atividade Física.

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

```bash
docker-compose up -d
```

Serviços disponíveis:
- Frontend: `http://localhost`
- Backend API: `http://localhost/api`
- Documentação: `http://localhost/api/docs`
- PostgreSQL: `localhost:55434`

Para parar os serviços:
```bash
docker-compose down
```

## Estrutura do Projeto

```
DataAging/
├── backend/          # API FastAPI
├── frontend/         # Aplicação React
├── proxy/            # Configuração Nginx
└── docker-compose.yml
```
