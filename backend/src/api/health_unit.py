from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from db.base import get_db
from schemas.health_unit import (
    HealthUnitCreate,
    HealthUnitUpdate,
    HealthUnitResponse
)
from services.health_unit_service import HealthUnitService
from api.auth.auth import get_current_user
from models.user.user import User

router = APIRouter()


@router.post("/health-units/", response_model=HealthUnitResponse, status_code=status.HTTP_201_CREATED)
def create_health_unit(
    health_unit: HealthUnitCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Cria uma nova unidade de saúde.
    
    **Corpo da Requisição:**
    - nome: Nome da unidade de saúde
    - bairro: Bairro
    - regiao: Região
    - ativo: Status ativo (padrão: True)
    
    **Retorna:**
    - Dados da unidade de saúde criada
    
    **Raises:**
    - 409: Nome da unidade de saúde já existe
    - 422: Erro de validação
    """
    return HealthUnitService.create_health_unit(db, health_unit)


@router.get("/health-units/", response_model=List[HealthUnitResponse])
def list_health_units(
    skip: int = Query(0, ge=0, description="Número de registros para pular"),
    limit: int = Query(100, ge=1, le=100, description="Número máximo de registros para retornar"),
    active_only: bool = Query(True, description="Filtrar apenas unidades ativas"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lista todas as unidades de saúde com paginação.
    
    **Parâmetros de Query:**
    - skip: Número de registros para pular (padrão: 0)
    - limit: Número máximo de registros para retornar (padrão: 100, máximo: 100)
    - active_only: Filtrar apenas unidades ativas (padrão: True)
    
    **Retorna:**
    - Lista de unidades de saúde
    """
    return HealthUnitService.get_all_health_units(db, skip, limit, active_only)


@router.get("/health-units/{health_unit_id}", response_model=HealthUnitResponse)
def get_health_unit(
    health_unit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtém uma unidade de saúde específica por ID.
    
    **Parâmetros de Caminho:**
    - health_unit_id: ID da unidade de saúde
    
    **Retorna:**
    - Dados da unidade de saúde
    
    **Raises:**
    - 404: Unidade de saúde não encontrada
    """
    return HealthUnitService.get_health_unit_by_id(db, health_unit_id)


@router.get("/health-units/region/{regiao}", response_model=List[HealthUnitResponse])
def get_health_units_by_region(
    regiao: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtém unidades de saúde por região.
    
    **Parâmetros de Caminho:**
    - regiao: Nome da região
    
    **Retorna:**
    - Lista de unidades de saúde na região
    """
    return HealthUnitService.get_health_units_by_region(db, regiao)


@router.put("/health-units/{health_unit_id}", response_model=HealthUnitResponse)
def update_health_unit(
    health_unit_id: int,
    health_unit_update: HealthUnitUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Atualiza uma unidade de saúde existente.
    
    **Parâmetros de Caminho:**
    - health_unit_id: ID da unidade de saúde para atualizar
    
    **Corpo da Requisição:**
    - Qualquer campo da unidade de saúde para atualizar (todos opcionais)
    
    **Retorna:**
    - Dados da unidade de saúde atualizada
    
    **Raises:**
    - 404: Unidade de saúde não encontrada
    - 409: Nome da unidade de saúde já existe (se atualizando o nome)
    """
    return HealthUnitService.update_health_unit(db, health_unit_id, health_unit_update)


@router.delete("/health-units/{health_unit_id}", status_code=status.HTTP_200_OK)
def delete_health_unit(
    health_unit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Deleta uma unidade de saúde (exclusão lógica).
    
    **Parâmetros de Caminho:**
    - health_unit_id: ID da unidade de saúde para deletar
    
    **Retorna:**
    - Mensagem de sucesso
    
    **Raises:**
    - 404: Unidade de saúde não encontrada
    """
    HealthUnitService.delete_health_unit(db, health_unit_id)
    return {"detail": "Unidade de saúde deletada"}
