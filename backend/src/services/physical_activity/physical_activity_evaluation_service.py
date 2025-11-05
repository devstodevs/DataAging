from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from fastapi import HTTPException, status
from db.physical_activity.physical_activity_evaluation_crud import (
    create_physical_activity_evaluation,
    get_physical_activity_evaluation,
    get_physical_activity_evaluations_by_patient,
    get_latest_evaluation_by_patient,
    update_physical_activity_evaluation,
    delete_physical_activity_evaluation
)
from db.physical_activity.physical_activity_patient_crud import get_physical_activity_patient
from schemas.physical_activity.physical_activity_evaluation import (
    PhysicalActivityEvaluationCreate,
    PhysicalActivityEvaluationUpdate,
    PhysicalActivityEvaluationResponse
)
from utils.physical_activity_calculator import (
    calculate_evaluation_metrics,
    validate_time_consistency
)


class PhysicalActivityEvaluationService:
    """Service layer for Physical Activity Evaluation operations"""
    
    @staticmethod
    def create_evaluation(
        db: Session, 
        patient_id: int, 
        evaluation_data: PhysicalActivityEvaluationCreate
    ) -> PhysicalActivityEvaluationResponse:
        """Create a new physical activity evaluation"""
        # Check if patient exists
        patient = get_physical_activity_patient(db, patient_id)
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Paciente não encontrado"
            )
        
        # Validate time consistency
        if not validate_time_consistency(
            evaluation_data.light_activity_minutes_per_day,
            evaluation_data.light_activity_days_per_week,
            evaluation_data.moderate_activity_minutes_per_day,
            evaluation_data.moderate_activity_days_per_week,
            evaluation_data.vigorous_activity_minutes_per_day,
            evaluation_data.vigorous_activity_days_per_week,
            evaluation_data.sedentary_hours_per_day,
            evaluation_data.screen_time_hours_per_day
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inconsistência nos dados de tempo: soma de atividades e sedentarismo excede limites razoáveis"
            )
        
        # Calculate metrics
        total_weekly_moderate, total_weekly_vigorous, who_compliance, sedentary_risk_level = calculate_evaluation_metrics(
            evaluation_data.light_activity_minutes_per_day,
            evaluation_data.light_activity_days_per_week,
            evaluation_data.moderate_activity_minutes_per_day,
            evaluation_data.moderate_activity_days_per_week,
            evaluation_data.vigorous_activity_minutes_per_day,
            evaluation_data.vigorous_activity_days_per_week,
            evaluation_data.sedentary_hours_per_day
        )
        
        # Prepare evaluation data
        evaluation_dict = evaluation_data.model_dump()
        evaluation_dict.update({
            "patient_id": patient_id,
            "total_weekly_moderate_minutes": total_weekly_moderate,
            "total_weekly_vigorous_minutes": total_weekly_vigorous,
            "who_compliance": who_compliance,
            "sedentary_risk_level": sedentary_risk_level
        })
        
        # Create evaluation
        db_evaluation = create_physical_activity_evaluation(db, evaluation_dict)
        
        return PhysicalActivityEvaluationResponse.model_validate(db_evaluation)
    
    @staticmethod
    def get_evaluation(db: Session, evaluation_id: int) -> PhysicalActivityEvaluationResponse:
        """Get a physical activity evaluation by ID"""
        db_evaluation = get_physical_activity_evaluation(db, evaluation_id)
        if not db_evaluation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Avaliação não encontrada"
            )
        
        return PhysicalActivityEvaluationResponse.model_validate(db_evaluation)
    
    @staticmethod
    def get_evaluations_by_patient(
        db: Session,
        patient_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[PhysicalActivityEvaluationResponse]:
        """Get all evaluations for a patient"""
        # Check if patient exists
        patient = get_physical_activity_patient(db, patient_id)
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Paciente não encontrado"
            )
        
        evaluations = get_physical_activity_evaluations_by_patient(db, patient_id, skip, limit)
        
        return [
            PhysicalActivityEvaluationResponse.model_validate(evaluation)
            for evaluation in evaluations
        ]
    
    @staticmethod
    def get_latest_evaluation(db: Session, patient_id: int) -> Optional[PhysicalActivityEvaluationResponse]:
        """Get the latest evaluation for a patient"""
        # Check if patient exists
        patient = get_physical_activity_patient(db, patient_id)
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Paciente não encontrado"
            )
        
        evaluation = get_latest_evaluation_by_patient(db, patient_id)
        if not evaluation:
            return None
        
        return PhysicalActivityEvaluationResponse.model_validate(evaluation)
    
    @staticmethod
    def update_evaluation(
        db: Session,
        evaluation_id: int,
        evaluation_data: PhysicalActivityEvaluationUpdate
    ) -> PhysicalActivityEvaluationResponse:
        """Update a physical activity evaluation"""
        # Check if evaluation exists
        existing_evaluation = get_physical_activity_evaluation(db, evaluation_id)
        if not existing_evaluation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Avaliação não encontrada"
            )
        
        # Get update data
        update_dict = evaluation_data.model_dump(exclude_unset=True)
        
        # If any activity or sedentary data is being updated, recalculate metrics
        activity_fields = [
            'light_activity_minutes_per_day', 'light_activity_days_per_week',
            'moderate_activity_minutes_per_day', 'moderate_activity_days_per_week',
            'vigorous_activity_minutes_per_day', 'vigorous_activity_days_per_week',
            'sedentary_hours_per_day', 'screen_time_hours_per_day'
        ]
        
        if any(field in update_dict for field in activity_fields):
            # Get current values and update with new ones
            current_data = {
                'light_activity_minutes_per_day': existing_evaluation.light_activity_minutes_per_day,
                'light_activity_days_per_week': existing_evaluation.light_activity_days_per_week,
                'moderate_activity_minutes_per_day': existing_evaluation.moderate_activity_minutes_per_day,
                'moderate_activity_days_per_week': existing_evaluation.moderate_activity_days_per_week,
                'vigorous_activity_minutes_per_day': existing_evaluation.vigorous_activity_minutes_per_day,
                'vigorous_activity_days_per_week': existing_evaluation.vigorous_activity_days_per_week,
                'sedentary_hours_per_day': existing_evaluation.sedentary_hours_per_day,
                'screen_time_hours_per_day': existing_evaluation.screen_time_hours_per_day
            }
            
            # Update with new values
            for field in activity_fields:
                if field in update_dict:
                    current_data[field] = update_dict[field]
            
            # Validate time consistency
            if not validate_time_consistency(**current_data):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Inconsistência nos dados de tempo: soma de atividades e sedentarismo excede limites razoáveis"
                )
            
            # Recalculate metrics
            total_weekly_moderate, total_weekly_vigorous, who_compliance, sedentary_risk_level = calculate_evaluation_metrics(
                current_data['light_activity_minutes_per_day'],
                current_data['light_activity_days_per_week'],
                current_data['moderate_activity_minutes_per_day'],
                current_data['moderate_activity_days_per_week'],
                current_data['vigorous_activity_minutes_per_day'],
                current_data['vigorous_activity_days_per_week'],
                current_data['sedentary_hours_per_day']
            )
            
            # Add calculated fields to update
            update_dict.update({
                "total_weekly_moderate_minutes": total_weekly_moderate,
                "total_weekly_vigorous_minutes": total_weekly_vigorous,
                "who_compliance": who_compliance,
                "sedentary_risk_level": sedentary_risk_level
            })
        
        # Update evaluation
        db_evaluation = update_physical_activity_evaluation(db, evaluation_id, update_dict)
        
        return PhysicalActivityEvaluationResponse.model_validate(db_evaluation)
    
    @staticmethod
    def delete_evaluation(db: Session, evaluation_id: int) -> Dict[str, str]:
        """Delete a physical activity evaluation"""
        # Check if evaluation exists
        existing_evaluation = get_physical_activity_evaluation(db, evaluation_id)
        if not existing_evaluation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Avaliação não encontrada"
            )
        
        # Delete evaluation
        success = delete_physical_activity_evaluation(db, evaluation_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro ao deletar avaliação"
            )
        
        return {"message": "Avaliação deletada com sucesso"}