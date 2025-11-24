# DataAging Backend API

## Configuração Inicial

```bash
# Criar ambiente virtual
python3 -m venv .venv

# Ativar ambiente virtual
source .venv/bin/activate  # Linux/Mac
# ou
.venv\Scripts\activate  # Windows

# Instalar dependências
pip install -r requirements.txt
```

## Executar API

```bash
cd src
python main.py
```

API disponível em: `http://localhost:8000`

## Popular Banco de Dados

Os scripts de população estão em `tests/populate/`. Execute na ordem:

```bash
# 1. Criar health units
python tests/populate/generate_complete_health_units.py

# 2. Popular dados IVCF
python tests/populate/generate_complete_ivcf_data.py

# 3. Popular dados FACTF
python tests/populate/generate_complete_factf_data.py

# 4. Popular dados Physical Activity
python tests/populate/generate_complete_physical_activity_data.py
```

**Nota:** Os scripts fazem login automaticamente usando as credenciais do usuário de teste (CPF: `11144477735`, Senha: `senha123`).

## Testar API com REST Client

1. Instale a extensão **REST Client** no VS Code
2. Abra qualquer arquivo `.http` em `tests/rest_client/`
3. Execute a requisição de login no início do arquivo
4. Copie o `access_token` da resposta
5. Cole o token na variável `@token = YOUR_TOKEN_HERE`
6. Execute as outras requisições

**Arquivos disponíveis:**
- `tests/rest_client/auth.http` - Autenticação
- `tests/rest_client/user.http` - Usuários
- `tests/rest_client/ivcf20/` - IVCF (patients, evaluations, dashboard)
- `tests/rest_client/factf/` - FACTF
- `tests/rest_client/main.http` - Endpoints globais

## Documentação da API

Acesse `http://localhost:8000/docs` para ver:
- Todas as rotas disponíveis
- Schemas de request/response
- Testar endpoints diretamente no navegador

## Autenticação

Todas as rotas (exceto `/login` e `/recover-password`) requerem autenticação:

```
Authorization: Bearer {token}
```

O token é obtido através do endpoint `/api/v1/login` usando CPF e senha.
