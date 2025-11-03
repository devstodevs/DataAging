from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, or_, desc
from typing import List, Optional
from models.factf.factf_patient import FACTFPatient
from models.factf.factf_evaluation import FACTFEvaluation


def create_factf_patient(db: Session, patient_data: dict) -> FACTFPatient:
    """Create a new FACT-F patient"""
    db_patient = FACTFPatient(**patient_data)
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient


def get_factf_patient(db: Session, patient_id: int) -> Optional[FACTFPatient]:
    """Get a FACT-F patient by ID"""
    return db.query(FACTFPatient).filter(FACTFPatient.id == patient_id).first()


def get_factf_patient_by_cpf(db: Session, cpf: str) -> Optional[FACTFPatient]:
    """Get a FACT-F patient by CPF"""
    return db.query(FACTFPatient).filter(FACTFPatient.cpf == cpf).first()


def get_factf_patients(
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
    """Get FACT-F patients with pagination and filters"""
    query = db.query(FACTFPatient)
    
    if active_only:
        query = query.filter(FACTFPatient.ativo == True)
    
    if bairro:
        query = query.filter(FACTFPatient.bairro.ilike(f"%{bairro}%"))
    
    if unidade_saude_id:
        query = query.filter(FACTFPatient.unidade_saude_id == unidade_saude_id)
    
    if idade_min:
        query = query.filter(FACTFPatient.idade >= idade_min)
    
    if idade_max:
        query = query.filter(FACTFPatient.idade <= idade_max)
    
    # Filter by fatigue classification from latest evaluation
    if classificacao_fadiga:
        subquery = db.query(FACTFEvaluation.patient_id).filter(
            FACTFEvaluation.classificacao_fadiga == classificacao_fadiga
        ).subquery()
        query = query.filter(FACTFPatient.id.in_(subquery))
    
    return query.offset(skip).limit(limit).all()


def update_factf_patient(db: Session, patient_id: int, patient_data: dict) -> Optional[FACTFPatient]:
    """Update a FACT-F patient"""
    db_patient = db.query(FACTFPatient).filter(FACTFPatient.id == patient_id).first()
    if db_patient:
        for key, value in patient_data.items():
            setattr(db_patient, key, value)
        db.commit()
        db.refresh(db_patient)
    return db_patient


def delete_factf_patient(db: Session, patient_id: int) -> bool:
    """Delete a FACT-F patient (soft delete)"""
    db_patient = db.query(FACTFPatient).filter(FACTFPatient.id == patient_id).first()
    if db_patient:
        db_patient.ativo = False
        db.commit()
        return True
    return False


def get_patient_evaluations(db: Session, patient_id: int) -> List[FACTFEvaluation]:
    """Get all evaluations for a patient"""
    return db.query(FACTFEvaluation).filter(
        FACTFEvaluation.patient_id == patient_id
    ).order_by(desc(FACTFEvaluation.data_avaliacao)).all()


def count_factf_patients(db: Session, active_only: bool = True) -> int:
    """Count total FACT-F patients"""
    query = db.query(FACTFPatient)
    if active_only:
        query = query.filter(FACTFPatient.ativo == True)
    return query.count()


def get_patients_with_latest_evaluation(db: Session, skip: int = 0, limit: int = 100) -> List[dict]:
    """Get patients with their latest evaluation data"""
    # Subquery to get latest evaluation for each patient
    latest_eval_subquery = db.query(
        FACTFEvaluation.patient_id,
        FACTFEvaluation.data_avaliacao.label('latest_date')
    ).group_by(FACTFEvaluation.patient_id).subquery()
    
    # Main query joining patients with their latest evaluation
    query = db.query(
        FACTFPatient,
        FACTFEvaluation.pontuacao_total,
        FACTFEvaluation.pontuacao_fadiga,
        FACTFEvaluation.classificacao_fadiga,
        FACTFEvaluation.data_avaliacao
    ).outerjoin(
        latest_eval_subquery,
        FACTFPatient.id == latest_eval_subquery.c.patient_id
    ).outerjoin(
        FACTFEvaluation,
        and_(
            FACTFEvaluation.patient_id == FACTFPatient.id,
            FACTFEvaluation.data_avaliacao == latest_eval_subquery.c.latest_date
        )
    ).filter(FACTFPatient.ativo == True)
    
    return query.offset(skip).limit(limit).all()