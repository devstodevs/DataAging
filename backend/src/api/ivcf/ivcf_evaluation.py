from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from db.base import get_db
from schemas.ivcf.ivcf_evaluation import (
    IVCFEvaluationCreate,
    IVCFEvaluationCreateSimple,
    IVCFEvaluationUpdate,
    IVCFEvaluationResponse,
    IVCFEvaluationWithPatient
)
from services.ivcf.ivcf_evaluation_service import IVCFEvaluationService
from api.auth.auth import get_current_user
from models.user.user import User

router = APIRouter()


@router.post("/ivcf-evaluations/", response_model=IVCFEvaluationResponse, status_code=status.HTTP_201_CREATED)
def create_ivcf_evaluation(
    evaluation: IVCFEvaluationCreateSimple,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Cria uma nova avaliação IVCF com cálculo automático de pontuação.
    
    **Corpo da Requisição:**
    - patient_id: ID do paciente
    - data_avaliacao: Data da avaliação (não pode ser futura)
    - dominio_*: Pontuações individuais dos domínios (0-5 cada) - apenas estes são obrigatórios
    - comorbidades: Comorbidades identificadas (opcional)
    - observacoes: Observações (opcional)
    
    **Nota:** A pontuação total e a classificação são calculadas automaticamente com base nas pontuações dos domínios.
    
    **Retorna:**
    - Dados da avaliação criada com pontuação total e classificação calculadas
    
    **Raises:**
    - 404: Paciente não encontrado
    - 422: Erro de validação
    """
    return IVCFEvaluationService.create_ivcf_evaluation(db, evaluation)


@router.get("/ivcf-evaluations/", response_model=List[IVCFEvaluationResponse])
def list_ivcf_evaluations(
    skip: int = Query(0, ge=0, description="Número de registros para pular"),
    limit: int = Query(100, ge=1, le=100, description="Número máximo de registros para retornar"),
    patient_id: Optional[int] = Query(None, description="Filtrar por ID do paciente"),
    period_from: Optional[date] = Query(None, description="Filtrar por data inicial"),
    period_to: Optional[date] = Query(None, description="Filtrar por data final"),
    classificacao: Optional[str] = Query(None, description="Filtrar por classificação"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lista todas as avaliações IVCF com paginação e filtros.
    
    **Parâmetros de Query:**
    - skip: Número de registros para pular (padrão: 0)
    - limit: Número máximo de registros para retornar (padrão: 100, máximo: 100)
    - patient_id: Filtrar por ID do paciente
    - period_from: Filtrar por data inicial
    - period_to: Filtrar por data final
    - classificacao: Filtrar por classificação (Robusto, Em Risco, Frágil)
    
    **Retorna:**
    - Lista de avaliações
    """
    return IVCFEvaluationService.get_all_ivcf_evaluations(
        db, skip, limit, patient_id, period_from, period_to, classificacao
    )


@router.get("/ivcf-evaluations/{evaluation_id}", response_model=IVCFEvaluationResponse)
def get_ivcf_evaluation(
    evaluation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtém uma avaliação IVCF específica por ID.
    
    **Parâmetros de Caminho:**
    - evaluation_id: ID da avaliação
    
    **Retorna:**
    - Dados da avaliação
    
    **Raises:**
    - 404: Avaliação não encontrada
    """
    return IVCFEvaluationService.get_ivcf_evaluation_by_id(db, evaluation_id)


@router.get("/ivcf-evaluations/patient/{patient_id}/latest", response_model=IVCFEvaluationResponse)
def get_latest_evaluation_by_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtém a avaliação mais recente de um paciente.
    
    **Parâmetros de Caminho:**
    - patient_id: ID do paciente
    
    **Retorna:**
    - Dados da avaliação mais recente
    
    **Raises:**
    - 404: Paciente não encontrado ou sem avaliações
    """
    evaluation = IVCFEvaluationService.get_latest_evaluation_by_patient(db, patient_id)
    if not evaluation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nenhuma avaliação encontrada para este paciente"
        )
    return evaluation





@router.put("/ivcf-evaluations/{evaluation_id}", response_model=IVCFEvaluationResponse)
def update_ivcf_evaluation(
    evaluation_id: int,
    evaluation_update: IVCFEvaluationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Atualiza uma avaliação IVCF existente.
    
    **Parâmetros de Caminho:**
    - evaluation_id: ID da avaliação para atualizar
    
    **Corpo da Requisição:**
    - Qualquer campo da avaliação para atualizar (todos opcionais)
    - Se atualizando pontuações dos domínios, a pontuação total e a classificação serão recalculadas
    
    **Retorna:**
    - Dados da avaliação atualizada
    
    **Raises:**
    - 404: Avaliação não encontrada
    """
    return IVCFEvaluationService.update_ivcf_evaluation(db, evaluation_id, evaluation_update)


@router.delete("/ivcf-evaluations/{evaluation_id}", status_code=status.HTTP_200_OK)
def delete_ivcf_evaluation(
    evaluation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Deleta uma avaliação IVCF.
    
    **Parâmetros de Caminho:**
    - evaluation_id: ID da avaliação para deletar
    
    **Retorna:**
    - Mensagem de sucesso
    
    **Raises:**
    - 404: Avaliação não encontrada
    """
    IVCFEvaluationService.delete_ivcf_evaluation(db, evaluation_id)
    return {"detail": "Avaliação deletada"}
