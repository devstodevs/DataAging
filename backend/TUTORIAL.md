# Tutorial Rápido: DataAging Backend

## 🚀 Como Rodar

### 1. Instalar Dependências

```bash
cd /home/demo/Documents/projects/DataAging/backend
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Iniciar o Servidor com Uvicorn

```bash
cd backend/src
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Pronto!** Servidor rodando em: **http://localhost:8000**

### 3. Acessar Documentação

- **Swagger UI**: http://localhost:8000/docs
- **API Root**: http://localhost:8000

---

## 📝 Testar a API

### Opção 1: Swagger UI (Recomendado)

1. Acesse http://localhost:8000/docs
2. Teste os endpoints diretamente na interface

### Opção 2: cURL

**Criar usuário Gestor:**
```bash
curl -X POST "http://localhost:8000/api/v1/users/" \
  -H "Content-Type: application/json" \
  -d '{
    "nome_completo": "João Silva",
    "cpf": "12345678901",
    "matricula": "GES001",
    "password": "senha123",
    "profile_type": "gestor"
  }'
```

**Criar usuário Técnico:**
```bash
curl -X POST "http://localhost:8000/api/v1/users/" \
  -H "Content-Type: application/json" \
  -d '{
    "nome_completo": "Maria Santos",
    "cpf": "98765432109",
    "registro_profissional": "CREA-SP 123456",
    "especialidade": "Engenharia Civil",
    "password": "senha456",
    "profile_type": "tecnico"
  }'
```

**Fazer login:**
```bash
curl -X POST "http://localhost:8000/api/v1/login" \
  -d "username=12345678901&password=senha123"
```

**Acessar dados do usuário logado:**
```bash
# Substitua SEU_TOKEN pelo token recebido no login
curl -X GET "http://localhost:8000/api/v1/me" \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 🔑 Endpoints Principais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/v1/login` | Login (retorna token JWT) |
| GET | `/api/v1/me` | Dados do usuário logado |
| POST | `/api/v1/users/` | Criar usuário |
| GET | `/api/v1/users/` | Listar usuários |
| GET | `/api/v1/users/{id}` | Buscar por ID |
| PUT | `/api/v1/users/{id}` | Atualizar |
| DELETE | `/api/v1/users/{id}` | Deletar |

---

## 🐛 Problemas Comuns

**Porta em uso:**
```bash
uvicorn src.main:app --reload --port 8001
```

**Resetar banco de dados:**
```bash
rm src/dataaging.db
uvicorn src.main:app --reload
```

**Módulo não encontrado:**
```bash
# Certifique-se de estar com o ambiente virtual ativado
source .venv/bin/activate
pip install -r requirements.txt
```

---

## 📚 Documentação Completa

- `API_DOCUMENTATION.md` - Documentação detalhada dos endpoints
- `AUTH_DOCUMENTATION.md` - Guia completo de autenticação
- `SETUP.md` - Guia de instalação detalhado
