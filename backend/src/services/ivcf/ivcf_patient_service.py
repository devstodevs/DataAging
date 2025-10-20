from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional
from schemas.ivcf.ivcf_patient import IVCFPatientCreate, IVCFPatientUpdate, IVCFPatientResponse
from db.ivcf import ivcf_patient_crud, health_unit_crud
from models.ivcf.ivcf_patient import IVCFPatient


class IVCFPatientService:
    """Service layer for IVCF patient business logic"""
    
    @staticmethod
    def create_ivcf_patient(db: Session, patient_create: IVCFPatientCreate) -> IVCFPatient:
        """
        Create a new IVCF patient with validation.
        
        Args:
            db: Database session
            patient_create: IVCF patient creation schema
            
        Returns:
            Created IVCFPatient object
            
        Raises:
            HTTPException: If CPF already exists or health unit not found
        """
        # Check if CPF already exists
        existing_patient = ivcf_patient_crud.get_ivcf_patient_by_cpf(db, patient_create.cpf)
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
        
        # Create patient
        patient_data = patient_create.model_dump()
        return ivcf_patient_crud.create_ivcf_patient(db, patient_data)
    
    @staticmethod
    def get_ivcf_patient_by_id(db: Session, patient_id: int) -> IVCFPatient:
        """
        Get an IVCF patient by ID.
        
        Args:
            db: Database session
            patient_id: Patient ID
            
        Returns:
            IVCFPatient object
            
        Raises:
            HTTPException: If patient not found
        """
        patient = ivcf_patient_crud.get_ivcf_patient(db, patient_id)
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Paciente não encontrado"
            )
        return patient
    
    @staticmethod
    def get_all_ivcf_patients(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        active_only: bool = True,
        bairro: Optional[str] = None,
        unidade_saude_id: Optional[int] = None,
        idade_min: Optional[int] = None,
        idade_max: Optional[int] = None
    ) -> List[IVCFPatient]:
        """
        Get all IVCF patients with pagination and filters.
        
        Args:
            db: Database session
            skip: Number of records to skip
            limit: Maximum number of records to return
            active_only: Filter only active patients
            bairro: Filter by neighborhood
            unidade_saude_id: Filter by health unit
            idade_min: Minimum age filter
            idade_max: Maximum age filter
            
        Returns:
            List of IVCFPatient objects
        """
        return ivcf_patient_crud.get_ivcf_patients(
            db, skip, limit, active_only, bairro, unidade_saude_id, idade_min, idade_max
        )
    
    @staticmethod
    def get_patients_by_region(db: Session, regiao: str) -> List[IVCFPatient]:
        """
        Get patients by region.
        
        Args:
            db: Database session
            regiao: Region name
            
        Returns:
            List of IVCFPatient objects
        """
        return ivcf_patient_crud.get_ivcf_patients_by_region(db, regiao)
    
    @staticmethod
    def get_patients_by_age_range(db: Session, age_range: str) -> List[IVCFPatient]:
        """
        Get patients by age range.
        
        Args:
            db: Database session
            age_range: Age range (60-70, 71-80, 81+)
            
        Returns:
            List of IVCFPatient objects
        """
        return ivcf_patient_crud.get_ivcf_patients_by_age_range(db, age_range)
    
    @staticmethod
    def update_ivcf_patient(
        db: Session,
        patient_id: int,
        patient_update: IVCFPatientUpdate
    ) -> IVCFPatient:
        """
        Update an IVCF patient.
        
        Args:
            db: Database session
            patient_id: Patient ID to update
            patient_update: IVCFPatientUpdate schema with updated data
            
        Returns:
            Updated IVCFPatient object
            
        Raises:
            HTTPException: If patient not found or validation fails
        """
        # Check if patient exists
        existing_patient = ivcf_patient_crud.get_ivcf_patient(db, patient_id)
        if not existing_patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Paciente não encontrado"
            )
        
        # If CPF is being updated, check for duplicates
        if patient_update.cpf and patient_update.cpf != existing_patient.cpf:
            cpf_exists = ivcf_patient_crud.get_ivcf_patient_by_cpf(db, patient_update.cpf)
            if cpf_exists:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="CPF já cadastrado"
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
        updated_patient = ivcf_patient_crud.update_ivcf_patient(db, patient_id, update_data)
        
        if not updated_patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Paciente não encontrado"
            )
        
        return updated_patient
    
    @staticmethod
    def delete_ivcf_patient(db: Session, patient_id: int) -> bool:
        """
        Delete an IVCF patient (soft delete).
        
        Args:
            db: Database session
            patient_id: Patient ID to delete
            
        Returns:
            True if deleted
            
        Raises:
            HTTPException: If patient not found
        """
        deleted = ivcf_patient_crud.delete_ivcf_patient(db, patient_id)
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
        patient = ivcf_patient_crud.get_ivcf_patient(db, patient_id)
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Paciente não encontrado"
            )
        
        return ivcf_patient_crud.get_patient_evaluations(db, patient_id)
    
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
        return ivcf_patient_crud.count_ivcf_patients(db, active_only)
