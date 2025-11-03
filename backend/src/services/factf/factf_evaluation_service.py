from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional
from datetime import date
from schemas.factf.factf_evaluation import FACTFEvaluationCreate, FACTFEvaluationUpdate
from db.factf import factf_evaluation_crud, factf_patient_crud
from models.factf.factf_evaluation import FACTFEvaluation
from utils.factf_calculator import calculate_factf_scores, validate_domain_scores


class FACTFEvaluationService:
    """Service layer for FACT-F evaluation business logic"""
    
    @staticmethod
    def create_factf_evaluation(db: Session, evaluation_create: FACTFEvaluationCreate) -> FACTFEvaluation:
        """
        Create a new FACT-F evaluation with automatic score calculation.
        
        Args:
            db: Database session
            evaluation_create: FACT-F evaluation creation schema
            
        Returns:
            Created FACTFEvaluation object
            
        Raises:
            HTTPException: If patient not found or validation fails
        """
        # Check if patient exists
        patient = factf_patient_crud.get_factf_patient(db, evaluation_create.patient_id)
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Paciente não encontrado"
            )
        
        # Prepare domain scores for calculation
        domain_scores = {
            'bem_estar_fisico': evaluation_create.bem_estar_fisico,
            'bem_estar_social': evaluation_create.bem_estar_social,
            'bem_estar_emocional': evaluation_create.bem_estar_emocional,
            'bem_estar_funcional': evaluation_create.bem_estar_funcional,
            'subescala_fadiga': evaluation_create.subescala_fadiga
        }
        
        # Validate domain scores
        if not validate_domain_scores(domain_scores):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Pontuações dos domínios fora dos limites permitidos"
            )
        
        # Calculate total scores and classification
        calculated_scores = calculate_factf_scores(domain_scores)
        
        # Prepare evaluation data
        evaluation_data = evaluation_create.model_dump()
        evaluation_data.update(calculated_scores)
        
        return factf_evaluation_crud.create_factf_evaluation(db, evaluation_data)
    
    @staticmethod
    def get_factf_evaluation_by_id(db: Session, evaluation_id: int) -> FACTFEvaluation:
        """
        Get a FACT-F evaluation by ID.
        
        Args:
            db: Database session
            evaluation_id: Evaluation ID
            
        Returns:
            FACTFEvaluation object
            
        Raises:
            HTTPException: If evaluation not found
        """
        evaluation = factf_evaluation_crud.get_factf_evaluation(db, evaluation_id)
        if not evaluation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Avaliação não encontrada"
            )
        return evaluation    

    @staticmethod
    def get_evaluations_by_patient(
        db: Session,
        patient_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[FACTFEvaluation]:
        """
        Get all evaluations for a specific patient.
        
        Args:
            db: Database session
            patient_id: Patient ID
            skip: Number of records to skip
            limit: Maximum number of records to return
            
        Returns:
            List of FACTFEvaluation objects
            
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
        
        return factf_evaluation_crud.get_evaluations_by_patient(db, patient_id, skip, limit)
    
    @staticmethod
    def update_factf_evaluation(
        db: Session,
        evaluation_id: int,
        evaluation_update: FACTFEvaluationUpdate
    ) -> FACTFEvaluation:
        """
        Update a FACT-F evaluation with recalculation of scores.
        
        Args:
            db: Database session
            evaluation_id: Evaluation ID to update
            evaluation_update: FACTFEvaluationUpdate schema with updated data
            
        Returns:
            Updated FACTFEvaluation object
            
        Raises:
            HTTPException: If evaluation not found or validation fails
        """
        # Check if evaluation exists
        existing_evaluation = factf_evaluation_crud.get_factf_evaluation(db, evaluation_id)
        if not existing_evaluation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Avaliação não encontrada"
            )
        
        # Prepare update data
        update_data = evaluation_update.model_dump(exclude_unset=True)
        
        # If any domain scores are being updated, recalculate totals
        domain_fields = ['bem_estar_fisico', 'bem_estar_social', 'bem_estar_emocional', 
                        'bem_estar_funcional', 'subescala_fadiga']
        
        if any(field in update_data for field in domain_fields):
            # Get current scores and update with new values
            current_scores = {
                'bem_estar_fisico': existing_evaluation.bem_estar_fisico,
                'bem_estar_social': existing_evaluation.bem_estar_social,
                'bem_estar_emocional': existing_evaluation.bem_estar_emocional,
                'bem_estar_funcional': existing_evaluation.bem_estar_funcional,
                'subescala_fadiga': existing_evaluation.subescala_fadiga
            }
            
            # Update with new values
            for field in domain_fields:
                if field in update_data:
                    current_scores[field] = update_data[field]
            
            # Validate updated scores
            if not validate_domain_scores(current_scores):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Pontuações dos domínios fora dos limites permitidos"
                )
            
            # Recalculate totals
            calculated_scores = calculate_factf_scores(current_scores)
            update_data.update(calculated_scores)
        
        # Update evaluation
        updated_evaluation = factf_evaluation_crud.update_factf_evaluation(db, evaluation_id, update_data)
        
        if not updated_evaluation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Avaliação não encontrada"
            )
        
        return updated_evaluation
    
    @staticmethod
    def delete_factf_evaluation(db: Session, evaluation_id: int) -> bool:
        """
        Delete a FACT-F evaluation.
        
        Args:
            db: Database session
            evaluation_id: Evaluation ID to delete
            
        Returns:
            True if deleted
            
        Raises:
            HTTPException: If evaluation not found
        """
        deleted = factf_evaluation_crud.delete_factf_evaluation(db, evaluation_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Avaliação não encontrada"
            )
        return True
    
    @staticmethod
    def get_latest_evaluation_by_patient(db: Session, patient_id: int) -> Optional[FACTFEvaluation]:
        """
        Get the latest evaluation for a patient.
        
        Args:
            db: Database session
            patient_id: Patient ID
            
        Returns:
            Latest FACTFEvaluation object or None
        """
        return factf_evaluation_crud.get_latest_evaluation_by_patient(db, patient_id)
    
    @staticmethod
    def get_critical_patients(db: Session, min_fatigue_score: float = 30.0) -> List[dict]:
        """
        Get patients with critical fatigue levels.
        
        Args:
            db: Database session
            min_fatigue_score: Minimum fatigue score to be considered critical
            
        Returns:
            List of patient data with critical fatigue
        """
        return factf_evaluation_crud.get_critical_patients(db, min_fatigue_score)
    
    @staticmethod
    def count_evaluations(db: Session, patient_id: Optional[int] = None) -> int:
        """
        Count total evaluations.
        
        Args:
            db: Database session
            patient_id: Optional patient ID to count evaluations for specific patient
            
        Returns:
            Total count
        """
        return factf_evaluation_crud.count_factf_evaluations(db, patient_id)