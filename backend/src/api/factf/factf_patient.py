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
    Create a new FACT-F patient.
    
    **Request Body:**
    - nome_completo: Full name
    - cpf: CPF (11-14 characters)
    - idade: Age (minimum 18)
    - telefone: Phone number (optional)
    - email: Email address (optional)
    - bairro: Neighborhood
    - unidade_saude_id: Health unit ID
    - diagnostico_principal: Main diagnosis (optional)
    - comorbidades: Comorbidities (optional)
    - tratamento_atual: Current treatment (optional)
    - data_cadastro: Registration date (default: today)
    
    **Returns:**
    - Created patient data
    
    **Raises:**
    - 409: CPF already exists
    - 404: Health unit not found
    - 422: Validation error
    """
    return FACTFPatientService.create_factf_patient(db, patient)


@router.get("/factf-patients/", response_model=List[FACTFPatientList])
def list_factf_patients(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=100, description="Maximum number of records to return"),
    active_only: bool = Query(True, description="Filter only active patients"),
    bairro: Optional[str] = Query(None, description="Filter by neighborhood"),
    unidade_saude_id: Optional[int] = Query(None, description="Filter by health unit ID"),
    idade_min: Optional[int] = Query(None, ge=18, description="Minimum age filter"),
    idade_max: Optional[int] = Query(None, le=120, description="Maximum age filter"),
    classificacao_fadiga: Optional[str] = Query(None, description="Filter by fatigue classification"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List FACT-F patients with pagination and filters.
    
    **Query Parameters:**
    - skip: Number of records to skip (pagination)
    - limit: Maximum records to return (max 100)
    - active_only: Show only active patients
    - bairro: Filter by neighborhood
    - unidade_saude_id: Filter by health unit
    - idade_min: Minimum age
    - idade_max: Maximum age
    - classificacao_fadiga: Filter by fatigue classification
    
    **Returns:**
    - List of patients with basic info and latest evaluation data
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
    Get a specific FACT-F patient by ID.
    
    **Path Parameters:**
    - patient_id: Patient ID
    
    **Returns:**
    - Patient data
    
    **Raises:**
    - 404: Patient not found
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
    Update a FACT-F patient.
    
    **Path Parameters:**
    - patient_id: Patient ID to update
    
    **Request Body:**
    - Any fields from FACTFPatientUpdate schema
    
    **Returns:**
    - Updated patient data
    
    **Raises:**
    - 404: Patient not found or health unit not found
    - 422: Validation error
    """
    return FACTFPatientService.update_factf_patient(db, patient_id, patient_update)


@router.delete("/factf-patients/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_factf_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a FACT-F patient (soft delete).
    
    **Path Parameters:**
    - patient_id: Patient ID to delete
    
    **Returns:**
    - No content (204)
    
    **Raises:**
    - 404: Patient not found
    """
    FACTFPatientService.delete_factf_patient(db, patient_id)


@router.get("/factf-patients/{patient_id}/evaluations")
def get_patient_evaluations(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all evaluations for a specific patient.
    
    **Path Parameters:**
    - patient_id: Patient ID
    
    **Returns:**
    - List of patient evaluations
    
    **Raises:**
    - 404: Patient not found
    """
    return FACTFPatientService.get_patient_evaluations(db, patient_id)