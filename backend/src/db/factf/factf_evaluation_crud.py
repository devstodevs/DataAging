from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, or_, desc, func
from typing import List, Optional
from datetime import date, datetime
from models.factf.factf_evaluation import FACTFEvaluation
from models.factf.factf_patient import FACTFPatient


def create_factf_evaluation(db: Session, evaluation_data: dict) -> FACTFEvaluation:
    """Create a new FACT-F evaluation"""
    db_evaluation = FACTFEvaluation(**evaluation_data)
    db.add(db_evaluation)
    db.commit()
    db.refresh(db_evaluation)
    return db_evaluation


def get_factf_evaluation(db: Session, evaluation_id: int) -> Optional[FACTFEvaluation]:
    """Get a FACT-F evaluation by ID"""
    return db.query(FACTFEvaluation).filter(FACTFEvaluation.id == evaluation_id).first()


def get_evaluations_by_patient(
    db: Session, 
    patient_id: int, 
    skip: int = 0, 
    limit: int = 100
) -> List[FACTFEvaluation]:
    """Get all evaluations for a specific patient"""
    return db.query(FACTFEvaluation).filter(
        FACTFEvaluation.patient_id == patient_id
    ).order_by(desc(FACTFEvaluation.data_avaliacao)).offset(skip).limit(limit).all()


def update_factf_evaluation(db: Session, evaluation_id: int, evaluation_data: dict) -> Optional[FACTFEvaluation]:
    """Update a FACT-F evaluation"""
    db_evaluation = db.query(FACTFEvaluation).filter(FACTFEvaluation.id == evaluation_id).first()
    if db_evaluation:
        for key, value in evaluation_data.items():
            setattr(db_evaluation, key, value)
        db.commit()
        db.refresh(db_evaluation)
    return db_evaluation


def delete_factf_evaluation(db: Session, evaluation_id: int) -> bool:
    """Delete a FACT-F evaluation"""
    db_evaluation = db.query(FACTFEvaluation).filter(FACTFEvaluation.id == evaluation_id).first()
    if db_evaluation:
        db.delete(db_evaluation)
        db.commit()
        return True
    return False


def get_latest_evaluation_by_patient(db: Session, patient_id: int) -> Optional[FACTFEvaluation]:
    """Get the latest evaluation for a patient"""
    return db.query(FACTFEvaluation).filter(
        FACTFEvaluation.patient_id == patient_id
    ).order_by(desc(FACTFEvaluation.data_avaliacao)).first()


def get_critical_patients(db: Session, min_fatigue_score: float = 30.0) -> List[dict]:
    """Get patients with critical fatigue levels"""
    # Subquery to get latest evaluation for each patient
    latest_eval_subquery = db.query(
        FACTFEvaluation.patient_id,
        func.max(FACTFEvaluation.data_avaliacao).label('latest_date')
    ).group_by(FACTFEvaluation.patient_id).subquery()
    
    # Main query for critical patients
    query = db.query(
        FACTFPatient.id,
        FACTFPatient.nome_completo,
        FACTFPatient.idade,
        FACTFPatient.bairro,
        FACTFEvaluation.pontuacao_total,
        FACTFEvaluation.pontuacao_fadiga,
        FACTFEvaluation.classificacao_fadiga,
        FACTFEvaluation.data_avaliacao
    ).join(
        latest_eval_subquery,
        FACTFPatient.id == latest_eval_subquery.c.patient_id
    ).join(
        FACTFEvaluation,
        and_(
            FACTFEvaluation.patient_id == FACTFPatient.id,
            FACTFEvaluation.data_avaliacao == latest_eval_subquery.c.latest_date
        )
    ).filter(
        and_(
            FACTFPatient.ativo == True,
            FACTFEvaluation.subescala_fadiga <= min_fatigue_score
        )
    ).order_by(FACTFEvaluation.subescala_fadiga)
    
    return query.all()


def count_factf_evaluations(db: Session, patient_id: Optional[int] = None) -> int:
    """Count total FACT-F evaluations"""
    query = db.query(FACTFEvaluation)
    if patient_id:
        query = query.filter(FACTFEvaluation.patient_id == patient_id)
    return query.count()


def get_evaluations_by_date_range(
    db: Session, 
    start_date: date, 
    end_date: date,
    skip: int = 0,
    limit: int = 100
) -> List[FACTFEvaluation]:
    """Get evaluations within a date range"""
    return db.query(FACTFEvaluation).filter(
        and_(
            FACTFEvaluation.data_avaliacao >= start_date,
            FACTFEvaluation.data_avaliacao <= end_date
        )
    ).order_by(desc(FACTFEvaluation.data_avaliacao)).offset(skip).limit(limit).all()


def get_evaluations_by_classification(
    db: Session, 
    classificacao: str,
    skip: int = 0,
    limit: int = 100
) -> List[FACTFEvaluation]:
    """Get evaluations by fatigue classification"""
    return db.query(FACTFEvaluation).filter(
        FACTFEvaluation.classificacao_fadiga == classificacao
    ).order_by(desc(FACTFEvaluation.data_avaliacao)).offset(skip).limit(limit).all()


def get_domain_averages(db: Session, start_date: Optional[date] = None, end_date: Optional[date] = None) -> dict:
    """Get average scores for each domain"""
    query = db.query(
        func.avg(FACTFEvaluation.bem_estar_fisico).label('avg_fisico'),
        func.avg(FACTFEvaluation.bem_estar_social).label('avg_social'),
        func.avg(FACTFEvaluation.bem_estar_emocional).label('avg_emocional'),
        func.avg(FACTFEvaluation.bem_estar_funcional).label('avg_funcional'),
        func.avg(FACTFEvaluation.subescala_fadiga).label('avg_fadiga'),
        func.avg(FACTFEvaluation.pontuacao_total).label('avg_total')
    )
    
    if start_date:
        query = query.filter(FACTFEvaluation.data_avaliacao >= start_date)
    if end_date:
        query = query.filter(FACTFEvaluation.data_avaliacao <= end_date)
    
    result = query.first()
    
    return {
        'bem_estar_fisico': float(result.avg_fisico or 0),
        'bem_estar_social': float(result.avg_social or 0),
        'bem_estar_emocional': float(result.avg_emocional or 0),
        'bem_estar_funcional': float(result.avg_funcional or 0),
        'subescala_fadiga': float(result.avg_fadiga or 0),
        'pontuacao_total': float(result.avg_total or 0)
    }


def get_patient_latest_domain_scores(db: Session, patient_id: int) -> Optional[dict]:
    """Get the latest domain scores for a specific patient"""
    latest_evaluation = db.query(FACTFEvaluation).filter(
        FACTFEvaluation.patient_id == patient_id
    ).order_by(desc(FACTFEvaluation.data_avaliacao)).first()
    
    if not latest_evaluation:
        return None
    
    return {
        'bem_estar_fisico': float(latest_evaluation.bem_estar_fisico),
        'bem_estar_social': float(latest_evaluation.bem_estar_social),
        'bem_estar_emocional': float(latest_evaluation.bem_estar_emocional),
        'bem_estar_funcional': float(latest_evaluation.bem_estar_funcional),
        'subescala_fadiga': float(latest_evaluation.subescala_fadiga),
        'pontuacao_total': float(latest_evaluation.pontuacao_total)
    }