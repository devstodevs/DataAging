from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional
from datetime import date
from schemas.factf.factf_patient import FACTFPatientCreate, FACTFPatientUpdate
from db.factf import factf_patient_crud
from db.ivcf import health_unit_crud
from models.factf.factf_patient import FACTFPatient


class FACTFPatientService:
    """Service layer for FACT-F patient business logic"""
    
    @staticmethod
    def create_factf_patient(db: Session, patient_create: FACTFPatientCreate) -> FACTFPatient:
        """
        Create a new FACT-F patient with validation.
        
        Args:
            db: Database session
            patient_create: FACT-F patient creation schema
            
        Returns:
            Created FACTFPatient object
            
        Raises:
            HTTPException: If CPF already exists or health unit not found
        """
        # Check if CPF already exists
        existing_patient = factf_patient_crud.get_factf_patient_by_cpf(db, patient_create.cpf)
        if existing_patient:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="CPF já cadastrado"
            )
        
        # Check if health unit exists
        health_unit = health_unit_crud.get_health_unit(db, patient_create.unidade_saude_id)
        if not health_unit:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Unidade de saúde não encontrada"
            )
        
        # Set registration date if not provided
        patient_data = patient_create.model_dump()
        if not patient_data.get('data_cadastro'):
            patient_data['data_cadastro'] = date.today()
        
        return factf_patient_crud.create_factf_patient(db, patient_data)
    
    @staticmethod
    def get_factf_patient_by_id(db: Session, patient_id: int) -> FACTFPatient:
        """
        Get a FACT-F patient by ID.
        
        Args:
            db: Database session
            patient_id: Patient ID
            
        Returns:
            FACTFPatient object
            
        Raises:
            HTTPException: If patient not found
        """
        patient = factf_patient_crud.get_factf_patient(db, patient_id)
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Paciente não encontrado"
            )
        return patient
    
    @staticmethod
    def get_all_factf_patients(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        active_only: bool = True,
        bairro: Optional[str] = None,
        unidade_saude_id: Optional[int] = None,
        idade_min: Optional[int] = None,
        idade_max: Optional[int] = None,
        classificacao_fadiga: Optional[str] = None
    ) -> List[FACTFPatient]:
        """
        Get all FACT-F patients with pagination and filters.
        
        Args:
            db: Database session
            skip: Number of records to skip
            limit: Maximum number of records to return
            active_only: Filter only active patients
            bairro: Filter by neighborhood
            unidade_saude_id: Filter by health unit
            idade_min: Minimum age filter
            idade_max: Maximum age filter
            classificacao_fadiga: Filter by fatigue classification
            
        Returns:
            List of FACTFPatient objects
        """
        return factf_patient_crud.get_factf_patients(
            db, skip, limit, active_only, bairro, unidade_saude_id, 
            idade_min, idade_max, classificacao_fadiga
        )
    
    @staticmethod
    def update_factf_patient(
        db: Session,
        patient_id: int,
        patient_update: FACTFPatientUpdate
    ) -> FACTFPatient:
        """
        Update a FACT-F patient.
        
        Args:
            db: Database session
            patient_id: Patient ID to update
            patient_update: FACTFPatientUpdate schema with updated data
            
        Returns:
            Updated FACTFPatient object
            
        Raises:
            HTTPException: If patient not found or validation fails
        """
        # Check if patient exists
        existing_patient = factf_patient_crud.get_factf_patient(db, patient_id)
        if not existing_patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Paciente não encontrado"
            )
        
        # If health unit is being updated, check if it exists
        if patient_update.unidade_saude_id:
            health_unit = health_unit_crud.get_health_unit(db, patient_update.unidade_saude_id)
            if not health_unit:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Unidade de saúde não encontrada"
                )
        
        # Update patient
        update_data = patient_update.model_dump(exclude_unset=True)
        updated_patient = factf_patient_crud.update_factf_patient(db, patient_id, update_data)
        
        if not updated_patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Paciente não encontrado"
            )
        
        return updated_patient
    
    @staticmethod
    def delete_factf_patient(db: Session, patient_id: int) -> bool:
        """
        Delete a FACT-F patient (soft delete).
        
        Args:
            db: Database session
            patient_id: Patient ID to delete
            
        Returns:
            True if deleted
            
        Raises:
            HTTPException: If patient not found
        """
        deleted = factf_patient_crud.delete_factf_patient(db, patient_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Paciente não encontrado"
            )
        return True
    
    @staticmethod
    def get_patient_evaluations(db: Session, patient_id: int) -> List:
        """
        Get all evaluations for a patient.
        
        Args:
            db: Database session
            patient_id: Patient ID
            
        Returns:
            List of evaluations
            
        Raises:
            HTTPException: If patient not found
        """
        # Check if patient exists
        patient = factf_patient_crud.get_factf_patient(db, patient_id)
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Paciente não encontrado"
            )
        
        return factf_patient_crud.get_patient_evaluations(db, patient_id)
    
    @staticmethod
    def count_patients(db: Session, active_only: bool = True) -> int:
        """
        Count total patients.
        
        Args:
            db: Database session
            active_only: Count only active patients
            
        Returns:
            Total count
        """
        return factf_patient_crud.count_factf_patients(db, active_only)