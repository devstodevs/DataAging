from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from db.base import get_db
from schemas.factf.factf_evaluation import (
    FACTFEvaluationCreate,
    FACTFEvaluationUpdate,
    FACTFEvaluationResponse,
    FACTFEvaluationList
)
from services.factf.factf_evaluation_service import FACTFEvaluationService
from api.auth.auth import get_current_user
from models.user.user import User

router = APIRouter()


@router.post("/factf-patients/{patient_id}/evaluations", response_model=FACTFEvaluationResponse, status_code=status.HTTP_201_CREATED)
def create_factf_evaluation(
    patient_id: int,
    evaluation: FACTFEvaluationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new FACT-F evaluation for a patient.
    
    **Path Parameters:**
    - patient_id: Patient ID
    
    **Request Body:**
    - data_avaliacao: Evaluation date
    - bem_estar_fisico: Physical well-being score (0-28)
    - bem_estar_social: Social well-being score (0-28)
    - bem_estar_emocional: Emotional well-being score (0-24)
    - bem_estar_funcional: Functional well-being score (0-28)
    - subescala_fadiga: Fatigue subscale score (0-52)
    - respostas_detalhadas: Detailed responses (optional JSON)
    - observacoes: Observations (optional)
    - profissional_responsavel: Responsible professional (optional)
    
    **Returns:**
    - Created evaluation with calculated total scores and classification
    
    **Raises:**
    - 404: Patient not found
    - 400: Invalid domain scores
    - 422: Validation error
    """
    # Set patient_id from path parameter
    evaluation.patient_id = patient_id
    return FACTFEvaluationService.create_factf_evaluation(db, evaluation)


@router.get("/factf-evaluations/{evaluation_id}", response_model=FACTFEvaluationResponse)
def get_factf_evaluation(
    evaluation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific FACT-F evaluation by ID.
    
    **Path Parameters:**
    - evaluation_id: Evaluation ID
    
    **Returns:**
    - Evaluation data
    
    **Raises:**
    - 404: Evaluation not found
    """
    return FACTFEvaluationService.get_factf_evaluation_by_id(db, evaluation_id)


@router.get("/factf-patients/{patient_id}/evaluations", response_model=List[FACTFEvaluationList])
def list_patient_evaluations(
    patient_id: int,
    skip: int = Query(0, ge=0, description="Número de registros para pular"),
    limit: int = Query(100, ge=1, le=100, description="Número máximo de registros para retornar"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lista todas as avaliações de um paciente específico.
    
    **Parâmetros de Caminho:**
    - patient_id: ID do paciente
    
    **Parâmetros de Query:**
    - skip: Número de registros para pular (paginação)
    - limit: Número máximo de registros para retornar (máximo 100)
    
    **Retorna:**
    - Lista de avaliações do paciente
    
    **Raises:**
    - 404: Paciente não encontrado
    """
    return FACTFEvaluationService.get_evaluations_by_patient(db, patient_id, skip, limit)

@router.put("/factf-evaluations/{evaluation_id}", response_model=FACTFEvaluationResponse)
def update_factf_evaluation(
    evaluation_id: int,
    evaluation_update: FACTFEvaluationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Atualiza uma avaliação FACT-F com recálculo automático de pontuações.
    
    **Parâmetros de Caminho:**
    - evaluation_id: ID da avaliação para atualizar
    
    **Corpo da Requisição:**
    - Qualquer campo do esquema FACTFEvaluationUpdate
    
    **Retorna:**
    - Avaliação atualizada com pontuações recalculadas
    
    **Raises:**
    - 404: Avaliação não encontrada
    - 400: Pontuações de domínio inválidas
    - 422: Erro de validação
    """
    return FACTFEvaluationService.update_factf_evaluation(db, evaluation_id, evaluation_update)


@router.delete("/factf-evaluations/{evaluation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_factf_evaluation(
    evaluation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Deleta uma avaliação FACT-F.
    
    **Parâmetros de Caminho:**
    - evaluation_id: ID da avaliação para deletar
    
    **Retorna:**
    - Sem conteúdo (204)
    
    **Raises:**
    - 404: Avaliação não encontrada
    """
    FACTFEvaluationService.delete_factf_evaluation(db, evaluation_id)


@router.get("/factf-patients/{patient_id}/evaluations/latest", response_model=FACTFEvaluationResponse)
def get_latest_patient_evaluation(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtém a avaliação mais recente de um paciente específico.
    
    **Parâmetros de Caminho:**
    - patient_id: ID do paciente
    
    **Retorna:**
    - Dados da avaliação mais recente ou 404 se nenhuma avaliação encontrada
    
    **Raises:**
    - 404: Paciente não encontrado ou nenhuma avaliação encontrada
    """
    evaluation = FACTFEvaluationService.get_latest_evaluation_by_patient(db, patient_id)
    if not evaluation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nenhuma avaliação encontrada para este paciente"
        )
    return evaluation