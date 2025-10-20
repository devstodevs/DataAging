from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional
from models.ivcf_patient import IVCFPatient


def create_ivcf_patient(db: Session, patient_data: dict) -> IVCFPatient:
    """Create a new IVCF patient"""
    db_patient = IVCFPatient(**patient_data)
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient


def get_ivcf_patient(db: Session, patient_id: int) -> Optional[IVCFPatient]:
    """Get an IVCF patient by ID"""
    return db.query(IVCFPatient).filter(IVCFPatient.id == patient_id).first()


def get_ivcf_patients(
    db: Session, 
    skip: int = 0, 
    limit: int = 100, 
    active_only: bool = True,
    bairro: Optional[str] = None,
    unidade_saude_id: Optional[int] = None,
    idade_min: Optional[int] = None,
    idade_max: Optional[int] = None
) -> List[IVCFPatient]:
    """Get IVCF patients with pagination and filters"""
    query = db.query(IVCFPatient)
    
    if active_only:
        query = query.filter(IVCFPatient.ativo == True)
    
    if bairro:
        query = query.filter(IVCFPatient.bairro.ilike(f"%{bairro}%"))
    
    if unidade_saude_id:
        query = query.filter(IVCFPatient.unidade_saude_id == unidade_saude_id)
    
    if idade_min:
        query = query.filter(IVCFPatient.idade >= idade_min)
    
    if idade_max:
        query = query.filter(IVCFPatient.idade <= idade_max)
    
    return query.offset(skip).limit(limit).all()


def get_ivcf_patient_by_cpf(db: Session, cpf: str) -> Optional[IVCFPatient]:
    """Get an IVCF patient by CPF"""
    return db.query(IVCFPatient).filter(IVCFPatient.cpf == cpf).first()


def get_ivcf_patients_by_region(db: Session, regiao: str) -> List[IVCFPatient]:
    """Get IVCF patients by region through health unit"""
    return db.query(IVCFPatient).join(
        IVCFPatient.health_unit
    ).filter(
        and_(
            IVCFPatient.health_unit.has(regiao=regiao),
            IVCFPatient.ativo == True
        )
    ).all()


def get_ivcf_patients_by_age_range(
    db: Session, 
    age_range: str
) -> List[IVCFPatient]:
    """Get IVCF patients by age range"""
    query = db.query(IVCFPatient).filter(IVCFPatient.ativo == True)
    
    if age_range == "60-70":
        query = query.filter(and_(IVCFPatient.idade >= 60, IVCFPatient.idade <= 70))
    elif age_range == "71-80":
        query = query.filter(and_(IVCFPatient.idade >= 71, IVCFPatient.idade <= 80))
    elif age_range == "81+":
        query = query.filter(IVCFPatient.idade >= 81)
    
    return query.all()


def update_ivcf_patient(db: Session, patient_id: int, patient_data: dict) -> Optional[IVCFPatient]:
    """Update an IVCF patient"""
    db_patient = db.query(IVCFPatient).filter(IVCFPatient.id == patient_id).first()
    
    if not db_patient:
        return None
    
    for key, value in patient_data.items():
        if value is not None:
            setattr(db_patient, key, value)
    
    db.commit()
    db.refresh(db_patient)
    return db_patient


def delete_ivcf_patient(db: Session, patient_id: int) -> bool:
    """Delete an IVCF patient (soft delete by setting ativo=False)"""
    db_patient = db.query(IVCFPatient).filter(IVCFPatient.id == patient_id).first()
    
    if not db_patient:
        return False
    
    db_patient.ativo = False
    db.commit()
    return True


def hard_delete_ivcf_patient(db: Session, patient_id: int) -> bool:
    """Hard delete an IVCF patient"""
    db_patient = db.query(IVCFPatient).filter(IVCFPatient.id == patient_id).first()
    
    if not db_patient:
        return False
    
    db.delete(db_patient)
    db.commit()
    return True


def get_patient_evaluations(db: Session, patient_id: int) -> List:
    """Get all evaluations for a patient"""
    patient = get_ivcf_patient(db, patient_id)
    if not patient:
        return []
    return patient.evaluations


def count_ivcf_patients(db: Session, active_only: bool = True) -> int:
    """Count total IVCF patients"""
    query = db.query(IVCFPatient)
    
    if active_only:
        query = query.filter(IVCFPatient.ativo == True)
    
    return query.count()
