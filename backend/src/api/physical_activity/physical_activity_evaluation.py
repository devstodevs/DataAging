from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from db.base import get_db
from services.physical_activity.physical_activity_evaluation_service import PhysicalActivityEvaluationService
from schemas.physical_activity.physical_activity_evaluation import (
    PhysicalActivityEvaluationCreate,
    PhysicalActivityEvaluationUpdate,
    PhysicalActivityEvaluationResponse
)
from api.auth.auth import get_current_user
from models.user.user import User

router = APIRouter()


@router.post("/physical-activity-patients/{patient_id}/evaluations", response_model=PhysicalActivityEvaluationResponse)
def create_physical_activity_evaluation(
    patient_id: int,
    evaluation_data: PhysicalActivityEvaluationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Cria uma nova avaliação de atividade física para um paciente"""
    # Add patient_id to evaluation data
    evaluation_dict = evaluation_data.model_dump()
    evaluation_dict['patient_id'] = patient_id
    return PhysicalActivityEvaluationService.create_evaluation(db, evaluation_dict)


@router.get("/physical-activity-evaluations/{evaluation_id}", response_model=PhysicalActivityEvaluationResponse)
def get_physical_activity_evaluation(
    evaluation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtém uma avaliação de atividade física por ID"""
    return PhysicalActivityEvaluationService.get_evaluation(db, evaluation_id)


@router.get("/physical-activity-patients/{patient_id}/evaluations", response_model=List[PhysicalActivityEvaluationResponse])
def get_patient_evaluations(
    patient_id: int,
    skip: int = Query(0, ge=0, description="Número de registros para pular"),
    limit: int = Query(100, ge=1, le=1000, description="Limite de registros"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtém todas as avaliações de um paciente"""
    return PhysicalActivityEvaluationService.get_evaluations_by_patient(db, patient_id, skip, limit)


@router.get("/physical-activity-patients/{patient_id}/evaluations/latest", response_model=Optional[PhysicalActivityEvaluationResponse])
def get_latest_patient_evaluation(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtém a avaliação mais recente de um paciente"""
    return PhysicalActivityEvaluationService.get_latest_evaluation_by_patient(db, patient_id)


@router.put("/physical-activity-evaluations/{evaluation_id}", response_model=PhysicalActivityEvaluationResponse)
def update_physical_activity_evaluation(
    evaluation_id: int,
    evaluation_data: PhysicalActivityEvaluationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Atualiza uma avaliação de atividade física"""
    update_dict = evaluation_data.model_dump(exclude_unset=True)
    return PhysicalActivityEvaluationService.update_evaluation(db, evaluation_id, update_dict)


@router.delete("/physical-activity-evaluations/{evaluation_id}")
def delete_physical_activity_evaluation(
    evaluation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Deleta uma avaliação de atividade física"""
    return PhysicalActivityEvaluationService.delete_evaluation(db, evaluation_id)