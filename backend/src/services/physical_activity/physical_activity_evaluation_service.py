from sqlalchemy.orm import Session
from sqlalchemy import and_, desc, func
from typing import List, Optional
from datetime import date, datetime, timedelta
from models.physical_activity.physical_activity_evaluation import PhysicalActivityEvaluation


class PhysicalActivityEvaluationService:
    """Service layer for Physical Activity Evaluation operations"""
    
    @staticmethod
    def create_evaluation(db: Session, evaluation_data: dict) -> PhysicalActivityEvaluation:
        """Create a new Physical Activity evaluation"""
        db_evaluation = PhysicalActivityEvaluation(**evaluation_data)
        db.add(db_evaluation)
        db.commit()
        db.refresh(db_evaluation)
        return db_evaluation
    
    @staticmethod
    def get_evaluation(db: Session, evaluation_id: int) -> Optional[PhysicalActivityEvaluation]:
        """Get a Physical Activity evaluation by ID"""
        return db.query(PhysicalActivityEvaluation).filter(PhysicalActivityEvaluation.id == evaluation_id).first()
    
    @staticmethod
    def get_evaluations_by_patient(
        db: Session, 
        patient_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[PhysicalActivityEvaluation]:
        """Get all evaluations for a specific patient"""
        return db.query(PhysicalActivityEvaluation).filter(
            PhysicalActivityEvaluation.patient_id == patient_id
        ).order_by(desc(PhysicalActivityEvaluation.data_avaliacao)).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_latest_evaluation_by_patient(db: Session, patient_id: int) -> Optional[PhysicalActivityEvaluation]:
        """Get the most recent evaluation for a patient"""
        return db.query(PhysicalActivityEvaluation).filter(
            PhysicalActivityEvaluation.patient_id == patient_id
        ).order_by(desc(PhysicalActivityEvaluation.data_avaliacao)).first()
    
    @staticmethod
    def update_evaluation(
        db: Session, 
        evaluation_id: int, 
        evaluation_data: dict
    ) -> Optional[PhysicalActivityEvaluation]:
        """Update a Physical Activity evaluation"""
        db_evaluation = db.query(PhysicalActivityEvaluation).filter(
            PhysicalActivityEvaluation.id == evaluation_id
        ).first()
        
        if not db_evaluation:
            return None
        
        for key, value in evaluation_data.items():
            if value is not None:
                setattr(db_evaluation, key, value)
        
        db.commit()
        db.refresh(db_evaluation)
        return db_evaluation
    
    @staticmethod
    def delete_evaluation(db: Session, evaluation_id: int) -> bool:
        """Delete a Physical Activity evaluation"""
        db_evaluation = db.query(PhysicalActivityEvaluation).filter(
            PhysicalActivityEvaluation.id == evaluation_id
        ).first()
        
        if not db_evaluation:
            return False
        
        db.delete(db_evaluation)
        db.commit()
        return True
    
    @staticmethod
    def get_evaluations_by_date_range(
        db: Session,
        start_date: date,
        end_date: date,
        skip: int = 0,
        limit: int = 100
    ) -> List[PhysicalActivityEvaluation]:
        """Get evaluations within a date range"""
        return db.query(PhysicalActivityEvaluation).filter(
            and_(
                PhysicalActivityEvaluation.data_avaliacao >= start_date,
                PhysicalActivityEvaluation.data_avaliacao <= end_date
            )
        ).order_by(desc(PhysicalActivityEvaluation.data_avaliacao)).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_evaluations_by_who_compliance(db: Session, compliant: bool) -> List[PhysicalActivityEvaluation]:
        """Get evaluations by WHO compliance status"""
        return db.query(PhysicalActivityEvaluation).filter(
            PhysicalActivityEvaluation.who_compliance == compliant
        ).all()
    
    @staticmethod
    def get_evaluations_by_sedentary_risk(db: Session, risk_level: str) -> List[PhysicalActivityEvaluation]:
        """Get evaluations by sedentary risk level"""
        return db.query(PhysicalActivityEvaluation).filter(
            PhysicalActivityEvaluation.sedentary_risk_level == risk_level
        ).all()
    
    @staticmethod
    def get_critical_sedentary_patients(db: Session) -> List[PhysicalActivityEvaluation]:
        """Get patients with critical sedentary risk (>10 hours/day)"""
        return db.query(PhysicalActivityEvaluation).filter(
            PhysicalActivityEvaluation.sedentary_risk_level == "Crítico"
        ).all()
    
    @staticmethod
    def count_evaluations_by_patient(db: Session, patient_id: int) -> int:
        """Count total evaluations for a patient"""
        return db.query(PhysicalActivityEvaluation).filter(
            PhysicalActivityEvaluation.patient_id == patient_id
        ).count()
    
    @staticmethod
    def get_monthly_evaluation_counts(db: Session, months: int = 12) -> List[dict]:
        """Get evaluation counts by month for the last N months"""
        start_date = date.today() - timedelta(days=months * 30)
        
        results = db.query(
            func.strftime('%Y-%m', PhysicalActivityEvaluation.data_avaliacao).label('month'),
            func.count(PhysicalActivityEvaluation.id).label('count')
        ).filter(
            PhysicalActivityEvaluation.data_avaliacao >= start_date
        ).group_by(
            func.strftime('%Y-%m', PhysicalActivityEvaluation.data_avaliacao)
        ).order_by('month').all()
        
        return [{'month': result.month, 'count': result.count} for result in results]
    
    @staticmethod
    def get_activity_distribution_stats(db: Session) -> dict:
        """Get distribution statistics for activity levels"""
        results = db.query(
            func.avg(PhysicalActivityEvaluation.light_activity_minutes_per_day * PhysicalActivityEvaluation.light_activity_days_per_week).label('avg_light_weekly'),
            func.avg(PhysicalActivityEvaluation.total_weekly_moderate_minutes).label('avg_moderate_weekly'),
            func.avg(PhysicalActivityEvaluation.total_weekly_vigorous_minutes).label('avg_vigorous_weekly'),
            func.avg(PhysicalActivityEvaluation.sedentary_hours_per_day).label('avg_sedentary_daily')
        ).first()
        
        return {
            'avg_light_weekly': float(results.avg_light_weekly or 0),
            'avg_moderate_weekly': float(results.avg_moderate_weekly or 0),
            'avg_vigorous_weekly': float(results.avg_vigorous_weekly or 0),
            'avg_sedentary_daily': float(results.avg_sedentary_daily or 0)
        }
    
    @staticmethod
    def get_who_compliance_stats(db: Session) -> dict:
        """Get WHO compliance statistics"""
        total = db.query(PhysicalActivityEvaluation).count()
        compliant = db.query(PhysicalActivityEvaluation).filter(
            PhysicalActivityEvaluation.who_compliance == True
        ).count()
        
        return {
            'total_evaluations': total,
            'compliant_count': compliant,
            'compliance_percentage': round((compliant / total * 100) if total > 0 else 0, 1)
        }