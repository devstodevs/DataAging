from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from db.base import get_db
from schemas.factf.factf_patient import (
    FACTFPatientCreate,
    FACTFPatientUpdate,
    FACTFPatientResponse,
    FACTFPatientList
)
from services.factf.factf_patient_service import FACTFPatientService
from api.auth.auth import get_current_user
from models.user.user import User

router = APIRouter()


@router.post("/factf-patients/", response_model=FACTFPatientResponse, status_code=status.HTTP_201_CREATED)
def create_factf_patient(
    patient: FACTFPatientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Cria um novo paciente FACT-F.
    
    **Corpo da Requisição:**
    - nome_completo: Nome completo
    - cpf: CPF (11-14 caracteres)
    - idade: Idade (mínimo 18)
    - telefone: Número de telefone (opcional)
    - email: Endereço de email (opcional)
    - bairro: Bairro
    - unidade_saude_id: ID da unidade de saúde
    - diagnostico_principal: Diagnóstico principal (opcional)
    - comorbidades: Comorbidades (opcional)
    - tratamento_atual: Tratamento atual (opcional)
    - data_cadastro: Data de cadastro (padrão: hoje)
    
    **Retorna:**
    - Dados do paciente criado
    
    **Raises:**
    - 409: CPF já existe
    - 404: Unidade de saúde não encontrada
    - 422: Erro de validação
    """
    return FACTFPatientService.create_factf_patient(db, patient)


@router.get("/factf-patients/", response_model=List[FACTFPatientList])
def list_factf_patients(
    skip: int = Query(0, ge=0, description="Número de registros para pular"),
    limit: int = Query(100, ge=1, le=100, description="Número máximo de registros para retornar"),
    active_only: bool = Query(True, description="Filtrar apenas pacientes ativos"),
    bairro: Optional[str] = Query(None, description="Filtrar por bairro"),
    unidade_saude_id: Optional[int] = Query(None, description="Filtrar por ID da unidade de saúde"),
    idade_min: Optional[int] = Query(None, ge=18, description="Filtro de idade mínima"),
    idade_max: Optional[int] = Query(None, le=120, description="Filtro de idade máxima"),
    classificacao_fadiga: Optional[str] = Query(None, description="Filtrar por classificação de fadiga"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lista pacientes FACT-F com paginação e filtros.
    
    **Parâmetros de Query:**
    - skip: Número de registros para pular (paginação)
    - limit: Número máximo de registros para retornar (máximo 100)
    - active_only: Mostrar apenas pacientes ativos
    - bairro: Filtrar por bairro
    - unidade_saude_id: Filtrar por unidade de saúde
    - idade_min: Idade mínima
    - idade_max: Idade máxima
    - classificacao_fadiga: Filtrar por classificação de fadiga
    
    **Retorna:**
    - Lista de pacientes com informações básicas e dados da última avaliação
    """
    return FACTFPatientService.get_all_factf_patients(
        db, skip, limit, active_only, bairro, unidade_saude_id,
        idade_min, idade_max, classificacao_fadiga
    )

@router.get("/factf-patients/{patient_id}", response_model=FACTFPatientResponse)
def get_factf_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtém um paciente FACT-F específico por ID.
    
    **Parâmetros de Caminho:**
    - patient_id: ID do paciente
    
    **Retorna:**
    - Dados do paciente
    
    **Raises:**
    - 404: Paciente não encontrado
    """
    return FACTFPatientService.get_factf_patient_by_id(db, patient_id)


@router.put("/factf-patients/{patient_id}", response_model=FACTFPatientResponse)
def update_factf_patient(
    patient_id: int,
    patient_update: FACTFPatientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Atualiza um paciente FACT-F.
    
    **Parâmetros de Caminho:**
    - patient_id: ID do paciente para atualizar
    
    **Corpo da Requisição:**
    - Qualquer campo do esquema FACTFPatientUpdate
    
    **Retorna:**
    - Dados do paciente atualizado
    
    **Raises:**
    - 404: Paciente não encontrado ou unidade de saúde não encontrada
    - 422: Erro de validação
    """
    return FACTFPatientService.update_factf_patient(db, patient_id, patient_update)


@router.delete("/factf-patients/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_factf_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Deleta um paciente FACT-F (exclusão lógica).
    
    **Parâmetros de Caminho:**
    - patient_id: ID do paciente para deletar
    
    **Retorna:**
    - Sem conteúdo (204)
    
    **Raises:**
    - 404: Paciente não encontrado
    """
    FACTFPatientService.delete_factf_patient(db, patient_id)


@router.get("/factf-patients/{patient_id}/evaluations")
def get_patient_evaluations(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtém todas as avaliações de um paciente específico.
    
    **Parâmetros de Caminho:**
    - patient_id: ID do paciente
    
    **Retorna:**
    - Lista de avaliações do paciente
    
    **Raises:**
    - 404: Paciente não encontrado
    """
    return FACTFPatientService.get_patient_evaluations(db, patient_id)