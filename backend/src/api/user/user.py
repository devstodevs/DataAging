from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from typing import List, Union
from db.base import get_db
from schemas.user import (
    UserCreateGestor,
    UserCreateTecnico,
    UserUpdate,
    UserResponse
)
from services.user import UserService
from api.auth.auth import get_current_user
from models.user.user import User

router = APIRouter()


@router.post("/users/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user: Union[UserCreateGestor, UserCreateTecnico] = Body(..., discriminator='profile_type'),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Cria um novo usuário (Gestor ou Técnico).
    
    **Corpo da Requisição:**
    - Para Gestor: Incluir `profile_type: "gestor"` e `matricula`
    - Para Técnico: Incluir `profile_type: "tecnico"` e opcionalmente `registro_profissional`, `especialidade`
    
    **Retorna:**
    - Dados do usuário criado (sem senha)
    
    **Raises:**
    - 409: CPF ou matrícula já existem
    - 422: Erro de validação
    """
    return UserService.create_new_user(db, user)


@router.get("/users/", response_model=List[UserResponse])
def list_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lista todos os usuários com paginação.
    
    **Parâmetros de Query:**
    - skip: Número de registros para pular (padrão: 0)
    - limit: Número máximo de registros para retornar (padrão: 100, máximo: 100)
    
    **Retorna:**
    - Lista de usuários (sem senhas)
    """
    if limit > 100:
        limit = 100
    return UserService.get_all_users(db, skip, limit)


@router.get("/users/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtém um usuário específico por ID.
    
    **Parâmetros de Caminho:**
    - user_id: ID do usuário
    
    **Retorna:**
    - Dados do usuário (sem senha)
    
    **Raises:**
    - 404: Usuário não encontrado
    """
    return UserService.get_user_by_id(db, user_id)


@router.put("/users/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Atualiza um usuário existente.
    
    **Parâmetros de Caminho:**
    - user_id: ID do usuário para atualizar
    
    **Corpo da Requisição:**
    - Qualquer campo do usuário para atualizar (todos opcionais)
    - Se atualizando senha, fornecer nova senha (será criptografada)
    
    **Retorna:**
    - Dados do usuário atualizado (sem senha)
    
    **Raises:**
    - 404: Usuário não encontrado
    - 409: CPF ou matrícula já existem (se atualizando esses campos)
    """
    return UserService.update_user(db, user_id, user_update)


@router.delete("/users/{user_id}", status_code=status.HTTP_200_OK)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Deleta um usuário.
    
    **Parâmetros de Caminho:**
    - user_id: ID do usuário para deletar
    
    **Retorna:**
    - Mensagem de sucesso
    
    **Raises:**
    - 404: Usuário não encontrado
    """
    UserService.delete_user(db, user_id)
    return {"detail": "Usuário deletado"}
