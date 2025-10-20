from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from db.base import get_db
from schemas.ivcf.ivcf_evaluation import (
    IVCFEvaluationCreate,
    IVCFEvaluationUpdate,
    IVCFEvaluationResponse,
    IVCFEvaluationWithPatient
)
from services.ivcf.ivcf_evaluation_service import IVCFEvaluationService

router = APIRouter()


@router.post("/ivcf-evaluations/", response_model=IVCFEvaluationResponse, status_code=status.HTTP_201_CREATED)
def create_ivcf_evaluation(
    evaluation: IVCFEvaluationCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new IVCF evaluation.
    
    **Request Body:**
    - patient_id: Patient ID
    - data_avaliacao: Evaluation date (cannot be future)
    - pontuacao_total: Total score (0-40)
    - classificacao: Classification (Robusto, Em Risco, Frágil)
    - dominio_*: Individual domain scores (0-5 each)
    - comorbidades: Identified comorbidities (optional)
    - observacoes: Observations (optional)
    
    **Returns:**
    - Created evaluation data
    
    **Raises:**
    - 404: Patient not found
    - 422: Validation error (score mismatch, invalid classification)
    """
    return IVCFEvaluationService.create_ivcf_evaluation(db, evaluation)


@router.get("/ivcf-evaluations/", response_model=List[IVCFEvaluationResponse])
def list_ivcf_evaluations(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=100, description="Maximum number of records to return"),
    patient_id: Optional[int] = Query(None, description="Filter by patient ID"),
    period_from: Optional[date] = Query(None, description="Filter by start date"),
    period_to: Optional[date] = Query(None, description="Filter by end date"),
    classificacao: Optional[str] = Query(None, description="Filter by classification"),
    db: Session = Depends(get_db)
):
    """
    List all IVCF evaluations with pagination and filters.
    
    **Query Parameters:**
    - skip: Number of records to skip (default: 0)
    - limit: Maximum number of records to return (default: 100, max: 100)
    - patient_id: Filter by patient ID
    - period_from: Filter by start date
    - period_to: Filter by end date
    - classificacao: Filter by classification (Robusto, Em Risco, Frágil)
    
    **Returns:**
    - List of evaluations
    """
    return IVCFEvaluationService.get_all_ivcf_evaluations(
        db, skip, limit, patient_id, period_from, period_to, classificacao
    )


@router.get("/ivcf-evaluations/{evaluation_id}", response_model=IVCFEvaluationResponse)
def get_ivcf_evaluation(
    evaluation_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific IVCF evaluation by ID.
    
    **Path Parameters:**
    - evaluation_id: Evaluation ID
    
    **Returns:**
    - Evaluation data
    
    **Raises:**
    - 404: Evaluation not found
    """
    return IVCFEvaluationService.get_ivcf_evaluation_by_id(db, evaluation_id)


@router.get("/ivcf-evaluations/patient/{patient_id}/latest", response_model=IVCFEvaluationResponse)
def get_latest_evaluation_by_patient(
    patient_id: int,
    db: Session = Depends(get_db)
):
    """
    Get the latest evaluation for a patient.
    
    **Path Parameters:**
    - patient_id: Patient ID
    
    **Returns:**
    - Latest evaluation data
    
    **Raises:**
    - 404: Patient not found or no evaluations
    """
    evaluation = IVCFEvaluationService.get_latest_evaluation_by_patient(db, patient_id)
    if not evaluation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nenhuma avaliação encontrada para este paciente"
        )
    return evaluation


@router.get("/ivcf-evaluations/critical-patients")
def get_critical_patients(
    pontuacao_minima: int = Query(20, ge=0, le=40, description="Minimum score for critical patients"),
    db: Session = Depends(get_db)
):
    """
    Get patients with critical scores.
    
    **Query Parameters:**
    - pontuacao_minima: Minimum score for critical patients (default: 20, range: 0-40)
    
    **Returns:**
    - List of critical patients data
    """
    return IVCFEvaluationService.get_critical_patients(db, pontuacao_minima)


@router.put("/ivcf-evaluations/{evaluation_id}", response_model=IVCFEvaluationResponse)
def update_ivcf_evaluation(
    evaluation_id: int,
    evaluation_update: IVCFEvaluationUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing IVCF evaluation.
    
    **Path Parameters:**
    - evaluation_id: Evaluation ID to update
    
    **Request Body:**
    - Any evaluation fields to update (all optional)
    - If updating domain scores, total score and classification will be recalculated
    
    **Returns:**
    - Updated evaluation data
    
    **Raises:**
    - 404: Evaluation not found
    """
    return IVCFEvaluationService.update_ivcf_evaluation(db, evaluation_id, evaluation_update)


@router.delete("/ivcf-evaluations/{evaluation_id}", status_code=status.HTTP_200_OK)
def delete_ivcf_evaluation(
    evaluation_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete an IVCF evaluation.
    
    **Path Parameters:**
    - evaluation_id: Evaluation ID to delete
    
    **Returns:**
    - Success message
    
    **Raises:**
    - 404: Evaluation not found
    """
    IVCFEvaluationService.delete_ivcf_evaluation(db, evaluation_id)
    return {"detail": "Evaluation deleted"}
