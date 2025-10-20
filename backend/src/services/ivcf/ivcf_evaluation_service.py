from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional, Dict, Any
from datetime import date
from schemas.ivcf.ivcf_evaluation import IVCFEvaluationCreate, IVCFEvaluationUpdate, IVCFEvaluationResponse
from db.ivcf import ivcf_evaluation_crud, ivcf_patient_crud
from models.ivcf.ivcf_evaluation import IVCFEvaluation


class IVCFEvaluationService:
    """Service layer for IVCF evaluation business logic"""
    
    @staticmethod
    def create_ivcf_evaluation(db: Session, evaluation_create: IVCFEvaluationCreate) -> IVCFEvaluation:
        """
        Create a new IVCF evaluation with validation.
        
        Args:
            db: Database session
            evaluation_create: IVCF evaluation creation schema
            
        Returns:
            Created IVCFEvaluation object
            
        Raises:
            HTTPException: If patient not found or validation fails
        """
        # Check if patient exists
        patient = ivcf_patient_crud.get_ivcf_patient(db, evaluation_create.patient_id)
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Paciente não encontrado"
            )
        
        # Check if patient already has an evaluation
        existing_evaluation = ivcf_evaluation_crud.get_ivcf_evaluation_by_patient(db, evaluation_create.patient_id)
        
        # Validate total score matches sum of domains
        domain_scores = [
            evaluation_create.dominio_idade,
            evaluation_create.dominio_comorbidades,
            evaluation_create.dominio_comunicacao,
            evaluation_create.dominio_mobilidade,
            evaluation_create.dominio_humor,
            evaluation_create.dominio_cognicao,
            evaluation_create.dominio_avd,
            evaluation_create.dominio_autopercepcao
        ]
        
        expected_total = sum(domain_scores)
        if evaluation_create.pontuacao_total != expected_total:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Pontuação total ({evaluation_create.pontuacao_total}) deve ser igual à soma dos domínios ({expected_total})"
            )
        
        # Validate classification based on score
        if evaluation_create.pontuacao_total <= 12 and evaluation_create.classificacao != "Robusto":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Pontuação 0-12 deve ser classificada como 'Robusto'"
            )
        elif 13 <= evaluation_create.pontuacao_total <= 19 and evaluation_create.classificacao != "Em Risco":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Pontuação 13-19 deve ser classificada como 'Em Risco'"
            )
        elif evaluation_create.pontuacao_total >= 20 and evaluation_create.classificacao != "Frágil":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Pontuação 20-40 deve ser classificada como 'Frágil'"
            )
        
        # Create or update evaluation
        evaluation_data = evaluation_create.model_dump()
        
        if existing_evaluation:
            # Update existing evaluation
            return ivcf_evaluation_crud.update_ivcf_evaluation(db, existing_evaluation.id, evaluation_data)
        else:
            # Create new evaluation
            return ivcf_evaluation_crud.create_ivcf_evaluation(db, evaluation_data)
    
    @staticmethod
    def get_ivcf_evaluation_by_id(db: Session, evaluation_id: int) -> IVCFEvaluation:
        """
        Get an IVCF evaluation by ID.
        
        Args:
            db: Database session
            evaluation_id: Evaluation ID
            
        Returns:
            IVCFEvaluation object
            
        Raises:
            HTTPException: If evaluation not found
        """
        evaluation = ivcf_evaluation_crud.get_ivcf_evaluation(db, evaluation_id)
        if not evaluation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Avaliação não encontrada"
            )
        return evaluation
    
    @staticmethod
    def get_all_ivcf_evaluations(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        patient_id: Optional[int] = None,
        period_from: Optional[date] = None,
        period_to: Optional[date] = None,
        classificacao: Optional[str] = None
    ) -> List[IVCFEvaluation]:
        """
        Get all IVCF evaluations with pagination and filters.
        
        Args:
            db: Database session
            skip: Number of records to skip
            limit: Maximum number of records to return
            patient_id: Filter by patient ID
            period_from: Filter by start date
            period_to: Filter by end date
            classificacao: Filter by classification
            
        Returns:
            List of IVCFEvaluation objects
        """
        return ivcf_evaluation_crud.get_ivcf_evaluations(
            db, skip, limit, patient_id, period_from, period_to, classificacao
        )
    
    @staticmethod
    def get_latest_evaluation_by_patient(db: Session, patient_id: int) -> Optional[IVCFEvaluation]:
        """
        Get the latest evaluation for a patient.
        
        Args:
            db: Database session
            patient_id: Patient ID
            
        Returns:
            Latest IVCFEvaluation object or None
            
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
        
        return ivcf_evaluation_crud.get_latest_evaluation_by_patient(db, patient_id)
    

    
    @staticmethod
    def get_domain_distribution(
        db: Session,
        period_from: Optional[date] = None,
        period_to: Optional[date] = None,
        region: Optional[str] = None,
        health_unit_id: Optional[int] = None,
        age_range: Optional[str] = None,
        classification: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Get domain distribution with filters.
        
        Args:
            db: Database session
            period_from: Start date filter
            period_to: End date filter
            region: Region filter
            health_unit_id: Health unit filter
            age_range: Age range filter
            classification: Classification filter
            
        Returns:
            List of domain distribution data
        """
        return ivcf_evaluation_crud.get_domain_distribution(
            db, period_from, period_to, region, health_unit_id, age_range, classification
        )
    
    @staticmethod
    def get_region_averages(
        db: Session,
        period_from: Optional[date] = None,
        period_to: Optional[date] = None
    ) -> List[Dict[str, Any]]:
        """
        Get average scores by region.
        
        Args:
            db: Database session
            period_from: Start date filter
            period_to: End date filter
            
        Returns:
            List of region average data
        """
        return ivcf_evaluation_crud.get_region_averages(db, period_from, period_to)
    
    @staticmethod
    def get_monthly_evolution(db: Session, months_back: int = 6) -> List[Dict[str, Any]]:
        """
        Get monthly evolution for the last N months.
        
        Args:
            db: Database session
            months_back: Number of months to look back
            
        Returns:
            List of monthly evolution data
        """
        return ivcf_evaluation_crud.get_monthly_evolution(db, months_back)
    
    @staticmethod
    def update_ivcf_evaluation(
        db: Session,
        evaluation_id: int,
        evaluation_update: IVCFEvaluationUpdate
    ) -> IVCFEvaluation:
        """
        Update an IVCF evaluation.
        
        Args:
            db: Database session
            evaluation_id: Evaluation ID to update
            evaluation_update: IVCFEvaluationUpdate schema with updated data
            
        Returns:
            Updated IVCFEvaluation object
            
        Raises:
            HTTPException: If evaluation not found or validation fails
        """
        # Check if evaluation exists
        existing_evaluation = ivcf_evaluation_crud.get_ivcf_evaluation(db, evaluation_id)
        if not existing_evaluation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Avaliação não encontrada"
            )
        
        # If updating scores, validate consistency
        update_data = evaluation_update.model_dump(exclude_unset=True)
        
        # If updating domain scores or total score, recalculate
        if any(key.startswith('dominio_') for key in update_data.keys()) or 'pontuacao_total' in update_data:
            # Get current values and merge with update data
            current_data = existing_evaluation.__dict__.copy()
            current_data.update(update_data)
            
            # Calculate expected total from merged data
            domain_scores = [
                current_data.get('dominio_idade', 0),
                current_data.get('dominio_comorbidades', 0),
                current_data.get('dominio_comunicacao', 0),
                current_data.get('dominio_mobilidade', 0),
                current_data.get('dominio_humor', 0),
                current_data.get('dominio_cognicao', 0),
                current_data.get('dominio_avd', 0),
                current_data.get('dominio_autopercepcao', 0),
            ]
            
            expected_total = sum(domain_scores)
            if 'pontuacao_total' not in update_data:
                update_data['pontuacao_total'] = expected_total
            
            # Update classification based on new total
            new_total = update_data.get('pontuacao_total', expected_total)
            if new_total <= 12:
                update_data['classificacao'] = "Robusto"
            elif 13 <= new_total <= 19:
                update_data['classificacao'] = "Em Risco"
            else:
                update_data['classificacao'] = "Frágil"
        
        # Update evaluation
        updated_evaluation = ivcf_evaluation_crud.update_ivcf_evaluation(db, evaluation_id, update_data)
        
        if not updated_evaluation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Avaliação não encontrada"
            )
        
        return updated_evaluation
    
    @staticmethod
    def delete_ivcf_evaluation(db: Session, evaluation_id: int) -> bool:
        """
        Delete an IVCF evaluation.
        
        Args:
            db: Database session
            evaluation_id: Evaluation ID to delete
            
        Returns:
            True if deleted
            
        Raises:
            HTTPException: If evaluation not found
        """
        deleted = ivcf_evaluation_crud.delete_ivcf_evaluation(db, evaluation_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Avaliação não encontrada"
            )
        return True
