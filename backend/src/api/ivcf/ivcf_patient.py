from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from db.base import get_db
from schemas.ivcf.ivcf_patient import (
    IVCFPatientCreate,
    IVCFPatientUpdate,
    IVCFPatientResponse,
    IVCFPatientWithEvaluations
)
from services.ivcf.ivcf_patient_service import IVCFPatientService
from api.auth.auth import get_current_user
from models.user.user import User

router = APIRouter()


@router.post("/ivcf-patients/", response_model=IVCFPatientResponse, status_code=status.HTTP_201_CREATED)
def create_ivcf_patient(
    patient: IVCFPatientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new IVCF patient.
    
    **Request Body:**
    - nome_completo: Full name
    - cpf: CPF (11-14 characters)
    - idade: Age (minimum 60)
    - telefone: Phone number (optional)
    - bairro: Neighborhood
    - unidade_saude_id: Health unit ID
    - data_cadastro: Registration date (default: today)
    
    **Returns:**
    - Created patient data
    
    **Raises:**
    - 409: CPF already exists
    - 404: Health unit not found
    - 422: Validation error
    """
    return IVCFPatientService.create_ivcf_patient(db, patient)


@router.get("/ivcf-patients/", response_model=List[IVCFPatientResponse])
def list_ivcf_patients(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=100, description="Maximum number of records to return"),
    active_only: bool = Query(True, description="Filter only active patients"),
    bairro: Optional[str] = Query(None, description="Filter by neighborhood"),
    unidade_saude_id: Optional[int] = Query(None, description="Filter by health unit ID"),
    idade_min: Optional[int] = Query(None, ge=60, description="Minimum age filter"),
    idade_max: Optional[int] = Query(None, le=120, description="Maximum age filter"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List all IVCF patients with pagination and filters.
    
    **Query Parameters:**
    - skip: Number of records to skip (default: 0)
    - limit: Maximum number of records to return (default: 100, max: 100)
    - active_only: Filter only active patients (default: True)
    - bairro: Filter by neighborhood
    - unidade_saude_id: Filter by health unit ID
    - idade_min: Minimum age filter (minimum: 60)
    - idade_max: Maximum age filter (maximum: 120)
    
    **Returns:**
    - List of patients
    """
    return IVCFPatientService.get_all_ivcf_patients(
        db, skip, limit, active_only, bairro, unidade_saude_id, idade_min, idade_max
    )


@router.get("/ivcf-patients/{patient_id}", response_model=IVCFPatientResponse)
def get_ivcf_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific IVCF patient by ID.
    
    **Path Parameters:**
    - patient_id: Patient ID
    
    **Returns:**
    - Patient data
    
    **Raises:**
    - 404: Patient not found
    """
    return IVCFPatientService.get_ivcf_patient_by_id(db, patient_id)


@router.get("/ivcf-patients/{patient_id}/evaluation", response_model=IVCFPatientWithEvaluations)
def get_patient_with_evaluations(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a patient with all their evaluations.
    
    **Path Parameters:**
    - patient_id: Patient ID
    
    **Returns:**
    - Patient data with evaluations
    
    **Raises:**
    - 404: Patient not found
    """
    patient = IVCFPatientService.get_ivcf_patient_by_id(db, patient_id)
    evaluations = IVCFPatientService.get_patient_evaluations(db, patient_id)
    
    # Convert evaluations to dictionaries for serialization
    evaluations_data = []
    for evaluation in evaluations:
        eval_dict = {
            "id": evaluation.id,
            "patient_id": evaluation.patient_id,
            "data_avaliacao": evaluation.data_avaliacao,
            "pontuacao_total": evaluation.pontuacao_total,
            "classificacao": evaluation.classificacao,
            "dominio_idade": evaluation.dominio_idade,
            "dominio_comorbidades": evaluation.dominio_comorbidades,
            "dominio_comunicacao": evaluation.dominio_comunicacao,
            "dominio_mobilidade": evaluation.dominio_mobilidade,
            "dominio_humor": evaluation.dominio_humor,
            "dominio_cognicao": evaluation.dominio_cognicao,
            "dominio_avd": evaluation.dominio_avd,
            "dominio_autopercepcao": evaluation.dominio_autopercepcao,
            "comorbidades": evaluation.comorbidades,
            "observacoes": evaluation.observacoes
        }
        evaluations_data.append(eval_dict)
    
    # Convert patient to response format
    patient_data = {
        "id": patient.id,
        "nome_completo": patient.nome_completo,
        "cpf": patient.cpf,
        "idade": patient.idade,
        "telefone": patient.telefone,
        "bairro": patient.bairro,
        "unidade_saude_id": patient.unidade_saude_id,
        "data_cadastro": patient.data_cadastro,
        "ativo": patient.ativo,
        "evaluations": evaluations_data
    }
    
    return IVCFPatientWithEvaluations(**patient_data)


@router.get("/ivcf-patients/region/{regiao}", response_model=List[IVCFPatientResponse])
def get_patients_by_region(
    regiao: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get patients by region.
    
    **Path Parameters:**
    - regiao: Region name
    
    **Returns:**
    - List of patients in the region
    """
    return IVCFPatientService.get_patients_by_region(db, regiao)


@router.get("/ivcf-patients/age-range/{age_range}", response_model=List[IVCFPatientResponse])
def get_patients_by_age_range(
    age_range: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get patients by age range.
    
    **Path Parameters:**
    - age_range: Age range (60-70, 71-80, 81+)
    
    **Returns:**
    - List of patients in the age range
    
    **Raises:**
    - 422: Invalid age range
    """
    valid_ranges = ["60-70", "71-80", "81+"]
    if age_range not in valid_ranges:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Faixa etária inválida. Use: {', '.join(valid_ranges)}"
        )
    
    return IVCFPatientService.get_patients_by_age_range(db, age_range)


@router.get("/ivcf-patients/stats/count")
def get_patients_count(
    active_only: bool = Query(True, description="Count only active patients"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get total count of patients.
    
    **Query Parameters:**
    - active_only: Count only active patients (default: True)
    
    **Returns:**
    - Total count of patients
    """
    count = IVCFPatientService.count_patients(db, active_only)
    return {"total_patients": count}


@router.put("/ivcf-patients/{patient_id}", response_model=IVCFPatientResponse)
def update_ivcf_patient(
    patient_id: int,
    patient_update: IVCFPatientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update an existing IVCF patient.
    
    **Path Parameters:**
    - patient_id: Patient ID to update
    
    **Request Body:**
    - Any patient fields to update (all optional)
    
    **Returns:**
    - Updated patient data
    
    **Raises:**
    - 404: Patient not found
    - 409: CPF already exists (if updating CPF)
    - 404: Health unit not found (if updating health unit)
    """
    return IVCFPatientService.update_ivcf_patient(db, patient_id, patient_update)


@router.delete("/ivcf-patients/{patient_id}", status_code=status.HTTP_200_OK)
def delete_ivcf_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete an IVCF patient (soft delete).
    
    **Path Parameters:**
    - patient_id: Patient ID to delete
    
    **Returns:**
    - Success message
    
    **Raises:**
    - 404: Patient not found
    """
    IVCFPatientService.delete_ivcf_patient(db, patient_id)
    return {"detail": "Patient deleted"}
