from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
from db.base import get_db
from services.physical_activity.physical_activity_patient_service import PhysicalActivityPatientService
from schemas.physical_activity.physical_activity_patient import (
    PhysicalActivityPatientCreate,
    PhysicalActivityPatientUpdate,
    PhysicalActivityPatientResponse,
    PhysicalActivityPatientList
)
from api.auth.auth import get_current_user
from models.user.user import User

router = APIRouter()


@router.post("/", response_model=PhysicalActivityPatientResponse)
def create_physical_activity_patient(
    patient_data: PhysicalActivityPatientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new physical activity patient"""
    return PhysicalActivityPatientService.create_patient(db, patient_data)


@router.get("/", response_model=PhysicalActivityPatientList)
def get_physical_activity_patients(
    page: int = Query(1, ge=1, description="Número da página"),
    per_page: int = Query(20, ge=1, le=100, description="Itens por página"),
    active_only: bool = Query(True, description="Apenas pacientes ativos"),
    bairro: Optional[str] = Query(None, description="Filtrar por bairro"),
    unidade_saude_id: Optional[int] = Query(None, description="Filtrar por unidade de saúde"),
    idade_min: Optional[int] = Query(None, ge=60, description="Idade mínima"),
    idade_max: Optional[int] = Query(None, le=120, description="Idade máxima"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get paginated list of physical activity patients"""
    return PhysicalActivityPatientService.get_patients(
        db=db,
        page=page,
        per_page=per_page,
        active_only=active_only,
        bairro=bairro,
        unidade_saude_id=unidade_saude_id,
        idade_min=idade_min,
        idade_max=idade_max
    )


@router.get("/{patient_id}", response_model=PhysicalActivityPatientResponse)
def get_physical_activity_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a physical activity patient by ID"""
    return PhysicalActivityPatientService.get_patient(db, patient_id)


@router.put("/{patient_id}", response_model=PhysicalActivityPatientResponse)
def update_physical_activity_patient(
    patient_id: int,
    patient_data: PhysicalActivityPatientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a physical activity patient"""
    return PhysicalActivityPatientService.update_patient(db, patient_id, patient_data)


@router.delete("/{patient_id}")
def delete_physical_activity_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a physical activity patient (soft delete)"""
    return PhysicalActivityPatientService.delete_patient(db, patient_id)


@router.get("/{patient_id}/evaluations")
def get_patient_evaluations(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all evaluations for a patient"""
    return PhysicalActivityPatientService.get_patient_evaluations(db, patient_id)