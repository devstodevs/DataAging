# Arquitetura CRUD - DataAging Backend

Este documento explica a arquitetura e responsabilidades de cada componente do sistema CRUD do projeto DataAging.

## Visão Geral da Arquitetura

O projeto segue o padrão **Repository + Service + API** com FastAPI:

```
src/
├── models/          # SQLAlchemy ORM models
├── schemas/         # Pydantic schemas (validação)
├── db/             # CRUD operations (Repository)
├── services/       # Business logic (Service)
└── api/            # FastAPI routes (Controller)
```

## Componentes e Responsabilidades

### 1. Models (`models/`)
**Para que serve:** Define a estrutura das tabelas do banco de dados usando SQLAlchemy ORM.

```python
# Exemplo: models/user.py
class User(Base):
    __tablename__ = "users"  # Nome da tabela no banco
    
    id = Column(Integer, primary_key=True)  # Chave primária
    nome_completo = Column(String, nullable=False)  # Campo obrigatório
    cpf = Column(String, unique=True, nullable=False)  # Campo único
```

**Responsabilidades:**
- Mapear tabelas do banco para classes Python
- Definir tipos de dados, constraints e relacionamentos
- Gerar automaticamente as tabelas no banco (quando executar `Base.metadata.create_all()`)

---

### 2. Schemas (`schemas/`)
**Para que serve:** Validação e serialização de dados usando Pydantic.

```python
# Exemplo: schemas/user.py
class UserCreate(BaseModel):
    nome_completo: str = Field(..., min_length=3)  # Validação automática
    cpf: str = Field(..., min_length=11)
    
    @field_validator('cpf')
    def validate_cpf(cls, v):  # Validação customizada
        return ''.join(filter(str.isdigit, v))
```

**Responsabilidades:**
- **Validação:** Garantir que os dados estão corretos antes de salvar
- **Serialização:** Converter dados Python ↔ JSON
- **Documentação:** Gerar automaticamente a documentação da API
- **Type Safety:** IntelliSense e verificação de tipos

**Tipos de Schema:**
- `UserCreate`: Para criar novos registros
- `UserUpdate`: Para atualizar (todos campos opcionais)
- `UserResponse`: Para retornar dados (sem campos sensíveis como senha)

---

### 3. CRUD (`db/`)
**Para que serve:** Operações básicas de banco de dados (Repository Pattern).

```python
# Exemplo: db/user_crud.py
def get_user(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user_data: dict) -> User:
    db_user = User(**user_data)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
```

**Responsabilidades:**
- **Isolamento:** Separar lógica de banco da lógica de negócio
- **Reutilização:** Funções podem ser usadas em diferentes services
- **Testabilidade:** Fácil de mockar para testes
- **Operações básicas:** Create, Read, Update, Delete

---

### 4. Services (`services/`)
**Para que serve:** Lógica de negócio e regras da aplicação.

```python
# Exemplo: services/user_service.py
class UserService:
    @staticmethod
    def create_new_user(db: Session, user_create: UserCreateGestor) -> User:
        # Verificar se CPF já existe
        existing_user = user_crud.get_user_by_cpf(db, user_create.cpf)
        if existing_user:
            raise HTTPException(status_code=409, detail="CPF já cadastrado")
        
        # Hash da senha
        hashed_password = get_password_hash(user_create.password)
        
        # Criar usuário
        return user_crud.create_user(db, user_data)
```

**Responsabilidades:**
- **Validações de negócio:** CPF único, matrícula única, etc.
- **Transformações:** Hash de senhas, formatação de dados
- **Orquestração:** Chamar múltiplas operações CRUD
- **Tratamento de erros:** Converter erros de banco em HTTPExceptions
- **Regras complexas:** Lógica que não cabe no CRUD nem na API

---

### 5. API Routes (`api/`)
**Para que serve:** Endpoints HTTP da aplicação (Controller Pattern).

```python
# Exemplo: api/user.py
@router.post("/users/", response_model=UserResponse)
def create_user(user: UserCreateGestor, db: Session = Depends(get_db)):
    return UserService.create_new_user(db, user)
```

**Responsabilidades:**
- **Endpoints HTTP:** GET, POST, PUT, DELETE
- **Validação automática:** Pydantic valida os dados automaticamente
- **Documentação:** Swagger/OpenAPI gerado automaticamente
- **Dependency Injection:** `Depends(get_db)` injeta a sessão do banco
- **Status Codes:** Retornar códigos HTTP apropriados
- **Serialização:** Converter objetos Python em JSON

---

### 6. Config (`config.py`)
**Para que serve:** Configurações da aplicação.

```python
# Exemplo: config.py
class Settings(BaseSettings):
    PROJECT_NAME: str = "DataAging API"
    API_V1_PREFIX: str = "/api/v1"
    SECRET_KEY: str
    DATABASE_URL: str
```

**Responsabilidades:**
- **Variáveis de ambiente:** Conexão com banco, chaves secretas
- **Configurações globais:** URLs, prefixos, timeouts
- **Ambientes:** Desenvolvimento, produção, teste

---

### 7. Database Base (`db/base.py`)
**Para que serve:** Configuração da conexão com banco de dados.

```python
# Exemplo: db/base.py
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

**Responsabilidades:**
- **Conexão:** Configurar SQLAlchemy engine
- **Sessões:** Gerenciar sessões do banco
- **Base:** Classe base para todos os models
- **Dependency:** `get_db()` injeta sessão nas rotas

---

### 8. Main (`main.py`)
**Para que serve:** Ponto de entrada da aplicação FastAPI e configuração central.

```python
# Exemplo: main.py
from fastapi import FastAPI
from api.auth import router as auth_router
from api.user import router as user_router
from config import settings
from db.base import engine, Base
from models import user  # Import models to register them

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="DataAging API - Sistema de Gerenciamento"
)

# Include routers
app.include_router(auth_router, prefix=settings.API_V1_PREFIX, tags=["auth"])
app.include_router(user_router, prefix=settings.API_V1_PREFIX, tags=["users"])

@app.get("/")
def root():
    return {
        "message": "Welcome to DataAging API",
        "version": "1.0.0",
        "docs": "/docs"
    }
```

**Responsabilidades:**
- **Aplicação FastAPI:** Criar e configurar a instância principal da aplicação
- **Registro de Routers:** Incluir todos os routers da API com prefixos e tags
- **Criação de Tabelas:** Executar `Base.metadata.create_all()` para criar tabelas no banco
- **Configuração Global:** Definir título, versão e descrição da API
- **Endpoints Globais:** Endpoints que não pertencem a um router específico (como `/` e `/debug/routes`)
- **Servidor de Desenvolvimento:** Configurar uvicorn para desenvolvimento local

**Componentes Importantes:**
- **Imports de Models:** `from models import user` - Necessário para registrar os models no SQLAlchemy
- **Criação de Tabelas:** `Base.metadata.create_all(bind=engine)` - Cria automaticamente todas as tabelas definidas nos models
- **Registro de Routers:** `app.include_router()` - Conecta cada router à aplicação principal
- **Configuração de Tags:** Organiza endpoints no Swagger por funcionalidade

---

## Fluxo Completo de uma Requisição

1. **Cliente** faz POST `/api/v1/users/` com JSON
2. **FastAPI** recebe e valida com `UserCreate` schema
3. **API Route** chama `UserService.create_new_user()`
4. **Service** aplica regras de negócio (verificar CPF único, hash senha)
5. **Service** chama `user_crud.create_user()`
6. **CRUD** executa SQL no banco via SQLAlchemy
7. **Model** mapeia resultado para objeto Python
8. **Service** retorna objeto para API
9. **API** serializa com `UserResponse` schema
10. **FastAPI** retorna JSON para cliente

## Vantagens desta Arquitetura

- **Separação de responsabilidades:** Cada camada tem uma função específica
- **Testabilidade:** Fácil de testar cada camada isoladamente
- **Manutenibilidade:** Mudanças em uma camada não afetam outras
- **Reutilização:** Services e CRUDs podem ser reutilizados
- **Validação:** Pydantic garante dados válidos automaticamente
- **Documentação:** Swagger gerado automaticamente
- **Type Safety:** IntelliSense e verificação de tipos em tempo de desenvolvimento

## Tutorial: Como Criar uma Nova CRUD

### 1. **Criar o Model** (`models/nova_entidade.py`)
```python
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from db.base import Base

class NovaEntidade(Base):
    __tablename__ = "nova_entidade"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nome = Column(String, nullable=False)
    descricao = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<NovaEntidade(id={self.id}, nome={self.nome})>"
```

### 2. **Criar os Schemas** (`schemas/nova_entidade.py`)
```python
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class NovaEntidadeBase(BaseModel):
    nome: str = Field(..., min_length=1, max_length=100)
    descricao: Optional[str] = Field(None, max_length=500)

class NovaEntidadeCreate(NovaEntidadeBase):
    pass

class NovaEntidadeUpdate(BaseModel):
    nome: Optional[str] = Field(None, min_length=1, max_length=100)
    descricao: Optional[str] = Field(None, max_length=500)

class NovaEntidadeResponse(NovaEntidadeBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
```

### 3. **Criar o CRUD** (`db/nova_entidade_crud.py`)
```python
from sqlalchemy.orm import Session
from typing import Optional, List
from models.nova_entidade import NovaEntidade
from schemas.nova_entidade import NovaEntidadeCreate, NovaEntidadeUpdate

def get_nova_entidade(db: Session, id: int) -> Optional[NovaEntidade]:
    return db.query(NovaEntidade).filter(NovaEntidade.id == id).first()

def get_nova_entidades(db: Session, skip: int = 0, limit: int = 100) -> List[NovaEntidade]:
    return db.query(NovaEntidade).offset(skip).limit(limit).all()

def create_nova_entidade(db: Session, nova_entidade: NovaEntidadeCreate) -> NovaEntidade:
    db_nova_entidade = NovaEntidade(**nova_entidade.model_dump())
    db.add(db_nova_entidade)
    db.commit()
    db.refresh(db_nova_entidade)
    return db_nova_entidade

def update_nova_entidade(db: Session, id: int, nova_entidade: NovaEntidadeUpdate) -> Optional[NovaEntidade]:
    db_nova_entidade = get_nova_entidade(db, id)
    if not db_nova_entidade:
        return None
    
    update_data = nova_entidade.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_nova_entidade, field, value)
    
    db.commit()
    db.refresh(db_nova_entidade)
    return db_nova_entidade

def delete_nova_entidade(db: Session, id: int) -> bool:
    db_nova_entidade = get_nova_entidade(db, id)
    if not db_nova_entidade:
        return False
    
    db.delete(db_nova_entidade)
    db.commit()
    return True
```

### 4. **Criar o Service** (`services/nova_entidade_service.py`)
```python
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List
from schemas.nova_entidade import NovaEntidadeCreate, NovaEntidadeUpdate, NovaEntidadeResponse
from db import nova_entidade_crud
from models.nova_entidade import NovaEntidade

class NovaEntidadeService:
    @staticmethod
    def create_nova_entidade(db: Session, nova_entidade: NovaEntidadeCreate) -> NovaEntidade:
        return nova_entidade_crud.create_nova_entidade(db, nova_entidade)
    
    @staticmethod
    def get_nova_entidade(db: Session, id: int) -> NovaEntidade:
        nova_entidade = nova_entidade_crud.get_nova_entidade(db, id)
        if not nova_entidade:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Nova entidade não encontrada"
            )
        return nova_entidade
    
    @staticmethod
    def get_all_nova_entidades(db: Session, skip: int = 0, limit: int = 100) -> List[NovaEntidade]:
        return nova_entidade_crud.get_nova_entidades(db, skip, limit)
    
    @staticmethod
    def update_nova_entidade(db: Session, id: int, nova_entidade: NovaEntidadeUpdate) -> NovaEntidade:
        updated = nova_entidade_crud.update_nova_entidade(db, id, nova_entidade)
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Nova entidade não encontrada"
            )
        return updated
    
    @staticmethod
    def delete_nova_entidade(db: Session, id: int) -> bool:
        deleted = nova_entidade_crud.delete_nova_entidade(db, id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Nova entidade não encontrada"
            )
        return True
```

### 5. **Criar a API** (`api/nova_entidade.py`)
```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from db.base import get_db
from schemas.nova_entidade import NovaEntidadeCreate, NovaEntidadeUpdate, NovaEntidadeResponse
from services.nova_entidade_service import NovaEntidadeService

router = APIRouter()

@router.post("/nova-entidade/", response_model=NovaEntidadeResponse, status_code=status.HTTP_201_CREATED)
def create_nova_entidade(nova_entidade: NovaEntidadeCreate, db: Session = Depends(get_db)):
    return NovaEntidadeService.create_nova_entidade(db, nova_entidade)

@router.get("/nova-entidade/", response_model=List[NovaEntidadeResponse])
def list_nova_entidades(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return NovaEntidadeService.get_all_nova_entidades(db, skip, limit)

@router.get("/nova-entidade/{id}", response_model=NovaEntidadeResponse)
def get_nova_entidade(id: int, db: Session = Depends(get_db)):
    return NovaEntidadeService.get_nova_entidade(db, id)

@router.put("/nova-entidade/{id}", response_model=NovaEntidadeResponse)
def update_nova_entidade(id: int, nova_entidade: NovaEntidadeUpdate, db: Session = Depends(get_db)):
    return NovaEntidadeService.update_nova_entidade(db, id, nova_entidade)

@router.delete("/nova-entidade/{id}", status_code=status.HTTP_200_OK)
def delete_nova_entidade(id: int, db: Session = Depends(get_db)):
    NovaEntidadeService.delete_nova_entidade(db, id)
    return {"detail": "Nova entidade deletada"}
```

### 6. **Registrar no main.py**
```python
# Adicionar imports
from api.nova_entidade import router as nova_entidade_router
from models import nova_entidade  # Import para registrar o model

# Adicionar router (após os outros routers existentes)
app.include_router(nova_entidade_router, prefix=settings.API_V1_PREFIX, tags=["nova-entidade"])
```

**Importante:** 
- O import `from models import nova_entidade` é **obrigatório** para que o SQLAlchemy registre o model
- Sem esse import, a tabela não será criada no banco de dados
- O router deve ser adicionado após a criação da aplicação FastAPI

### 7. **Atualizar __init__.py**
```python
# Em models/__init__.py
from . import nova_entidade

# Em schemas/__init__.py  
from .nova_entidade import NovaEntidadeCreate, NovaEntidadeUpdate, NovaEntidadeResponse
```

## Endpoints Criados

- `POST /api/v1/nova-entidade/` - Criar
- `GET /api/v1/nova-entidade/` - Listar (com paginação)
- `GET /api/v1/nova-entidade/{id}` - Buscar por ID
- `PUT /api/v1/nova-entidade/{id}` - Atualizar
- `DELETE /api/v1/nova-entidade/{id}` - Deletar

## Padrões Seguidos

- **Validação:** Pydantic schemas
- **Business Logic:** Services
- **Database:** CRUD operations
- **API:** FastAPI routers
- **Error Handling:** HTTPException com status codes apropriados
- **Documentation:** Docstrings automáticas no Swagger
