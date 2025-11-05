from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from fastapi import HTTPException, status
from db.physical_activity.physical_activity_patient_crud import (
    create_physical_activity_patient,
    get_physical_activity_patient,
    get_physical_activity_patients,
    get_physical_activity_patient_by_cpf,
    update_physical_activity_patient,
    delete_physical_activity_patient,
    count_physical_activity_patients,
    get_patient_evaluations
)
from schemas.physical_activity.physical_activity_patient import (
    PhysicalActivityPatientCreate,
    PhysicalActivityPatientUpdate,
    PhysicalActivityPatientResponse,
    PhysicalActivityPatientList
)
import math


class PhysicalActivityPatientService:
    """Service layer for Physical Activity Patient operations"""
    
    @staticmethod
    def create_patient(db: Session, patient_data: PhysicalActivityPatientCreate) -> PhysicalActivityPatientResponse:
        """Create a new physical activity patient"""
        # Check if CPF already exists
        existing_patient = get_physical_activity_patient_by_cpf(db, patient_data.cpf)
        if existing_patient:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="CPF já cadastrado no sistema"
            )
        
        # Validate age (minimum 60 years for elderly focus)
        if patient_data.idade < 60:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Idade mínima para cadastro é 60 anos"
            )
        
        # Create patient
        patient_dict = patient_data.model_dump()
        db_patient = create_physical_activity_patient(db, patient_dict)
        
        return PhysicalActivityPatientResponse.model_validate(db_patient)
    
    @staticmethod
    def get_patient(db: Session, patient_id: int) -> PhysicalActivityPatientResponse:
        """Get a physical activity patient by ID"""
        db_patient = get_physical_activity_patient(db, patient_id)
        if not db_patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Paciente não encontrado"
            )
        
        return PhysicalActivityPatientResponse.model_validate(db_patient)
    
    @staticmethod
    def get_patients(
        db: Session,
        page: int = 1,
        per_page: int = 20,
        active_only: bool = True,
        bairro: Optional[str] = None,
        unidade_saude_id: Optional[int] = None,
        idade_min: Optional[int] = None,
        idade_max: Optional[int] = None
    ) -> PhysicalActivityPatientList:
        """Get paginated list of physical activity patients"""
        # Validate pagination parameters
        if page < 1:
            page = 1
        if per_page < 1 or per_page > 100:
            per_page = 20
        
        skip = (page - 1) * per_page
        
        # Get patients
        patients = get_physical_activity_patients(
            db=db,
            skip=skip,
            limit=per_page,
            active_only=active_only,
            bairro=bairro,
            unidade_saude_id=unidade_saude_id,
            idade_min=idade_min,
            idade_max=idade_max
        )
        
        # Get total count
        total = count_physical_activity_patients(db, active_only)
        total_pages = math.ceil(total / per_page)
        
        # Convert to response models
        patient_responses = [
            PhysicalActivityPatientResponse.model_validate(patient) 
            for patient in patients
        ]
        
        return PhysicalActivityPatientList(
            patients=patient_responses,
            total=total,
            page=page,
            per_page=per_page,
            total_pages=total_pages
        )
    
    @staticmethod
    def update_patient(
        db: Session, 
        patient_id: int, 
        patient_data: PhysicalActivityPatientUpdate
    ) -> PhysicalActivityPatientResponse:
        """Update a physical activity patient"""
        # Check if patient exists
        existing_patient = get_physical_activity_patient(db, patient_id)
        if not existing_patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Paciente não encontrado"
            )
        
        # Update patient
        update_dict = patient_data.model_dump(exclude_unset=True)
        db_patient = update_physical_activity_patient(db, patient_id, update_dict)
        
        return PhysicalActivityPatientResponse.model_validate(db_patient)
    
    @staticmethod
    def delete_patient(db: Session, patient_id: int) -> Dict[str, str]:
        """Delete a physical activity patient (soft delete)"""
        # Check if patient exists
        existing_patient = get_physical_activity_patient(db, patient_id)
        if not existing_patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Paciente não encontrado"
            )
        
        # Soft delete
        success = delete_physical_activity_patient(db, patient_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro ao deletar paciente"
            )
        
        return {"message": "Paciente deletado com sucesso"}
    
    @staticmethod
    def get_patient_evaluations(db: Session, patient_id: int) -> List[Dict[str, Any]]:
        """Get all evaluations for a patient"""
        # Check if patient exists
        existing_patient = get_physical_activity_patient(db, patient_id)
        if not existing_patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Paciente não encontrado"
            )
        
        evaluations = get_patient_evaluations(db, patient_id)
        return [
            {
                "id": eval.id,
                "data_avaliacao": eval.data_avaliacao,
                "sedentary_hours_per_day": eval.sedentary_hours_per_day,
                "who_compliance": eval.who_compliance,
                "sedentary_risk_level": eval.sedentary_risk_level,
                "total_weekly_moderate_minutes": eval.total_weekly_moderate_minutes,
                "total_weekly_vigorous_minutes": eval.total_weekly_vigorous_minutes
            }
            for eval in evaluations
        ]