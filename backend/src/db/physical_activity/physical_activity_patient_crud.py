from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional
from models.physical_activity.physical_activity_patient import PhysicalActivityPatient


def create_physical_activity_patient(db: Session, patient_data: dict) -> PhysicalActivityPatient:
    """Create a new Physical Activity patient"""
    db_patient = PhysicalActivityPatient(**patient_data)
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient


def get_physical_activity_patient(db: Session, patient_id: int) -> Optional[PhysicalActivityPatient]:
    """Get a Physical Activity patient by ID"""
    return db.query(PhysicalActivityPatient).filter(PhysicalActivityPatient.id == patient_id).first()


def get_physical_activity_patients(
    db: Session, 
    skip: int = 0, 
    limit: int = 100, 
    active_only: bool = True,
    bairro: Optional[str] = None,
    unidade_saude_id: Optional[int] = None,
    idade_min: Optional[int] = None,
    idade_max: Optional[int] = None
) -> List[PhysicalActivityPatient]:
    """Get Physical Activity patients with pagination and filters"""
    query = db.query(PhysicalActivityPatient)
    
    if active_only:
        query = query.filter(PhysicalActivityPatient.ativo == True)
    
    if bairro:
        query = query.filter(PhysicalActivityPatient.bairro.ilike(f"%{bairro}%"))
    
    if unidade_saude_id:
        query = query.filter(PhysicalActivityPatient.unidade_saude_id == unidade_saude_id)
    
    if idade_min:
        query = query.filter(PhysicalActivityPatient.idade >= idade_min)
    
    if idade_max:
        query = query.filter(PhysicalActivityPatient.idade <= idade_max)
    
    return query.offset(skip).limit(limit).all()


def get_physical_activity_patient_by_cpf(db: Session, cpf: str) -> Optional[PhysicalActivityPatient]:
    """Get a Physical Activity patient by CPF"""
    return db.query(PhysicalActivityPatient).filter(PhysicalActivityPatient.cpf == cpf).first()


def get_physical_activity_patients_by_region(db: Session, regiao: str) -> List[PhysicalActivityPatient]:
    """Get Physical Activity patients by region through health unit"""
    return db.query(PhysicalActivityPatient).join(
        PhysicalActivityPatient.health_unit
    ).filter(
        and_(
            PhysicalActivityPatient.health_unit.has(regiao=regiao),
            PhysicalActivityPatient.ativo == True
        )
    ).all()


def get_physical_activity_patients_by_age_range(
    db: Session, 
    age_range: str
) -> List[PhysicalActivityPatient]:
    """Get Physical Activity patients by age range"""
    query = db.query(PhysicalActivityPatient).filter(PhysicalActivityPatient.ativo == True)
    
    if age_range == "60-70":
        query = query.filter(and_(PhysicalActivityPatient.idade >= 60, PhysicalActivityPatient.idade <= 70))
    elif age_range == "71-80":
        query = query.filter(and_(PhysicalActivityPatient.idade >= 71, PhysicalActivityPatient.idade <= 80))
    elif age_range == "81+":
        query = query.filter(PhysicalActivityPatient.idade >= 81)
    
    return query.all()


def update_physical_activity_patient(db: Session, patient_id: int, patient_data: dict) -> Optional[PhysicalActivityPatient]:
    """Update a Physical Activity patient"""
    db_patient = db.query(PhysicalActivityPatient).filter(PhysicalActivityPatient.id == patient_id).first()
    
    if not db_patient:
        return None
    
    for key, value in patient_data.items():
        if value is not None:
            setattr(db_patient, key, value)
    
    db.commit()
    db.refresh(db_patient)
    return db_patient


def delete_physical_activity_patient(db: Session, patient_id: int) -> bool:
    """Delete a Physical Activity patient (soft delete by setting ativo=False)"""
    db_patient = db.query(PhysicalActivityPatient).filter(PhysicalActivityPatient.id == patient_id).first()
    
    if not db_patient:
        return False
    
    db_patient.ativo = False
    db.commit()
    return True


def hard_delete_physical_activity_patient(db: Session, patient_id: int) -> bool:
    """Hard delete a Physical Activity patient"""
    db_patient = db.query(PhysicalActivityPatient).filter(PhysicalActivityPatient.id == patient_id).first()
    
    if not db_patient:
        return False
    
    db.delete(db_patient)
    db.commit()
    return True


def get_patient_evaluations(db: Session, patient_id: int) -> List:
    """Get all evaluations for a patient"""
    patient = get_physical_activity_patient(db, patient_id)
    if not patient:
        return []
    return patient.evaluations


def count_physical_activity_patients(db: Session, active_only: bool = True) -> int:
    """Count total Physical Activity patients"""
    query = db.query(PhysicalActivityPatient)
    
    if active_only:
        query = query.filter(PhysicalActivityPatient.ativo == True)
    
    return query.count()


def get_patients_with_conditions(db: Session, conditions: List[str]) -> List[PhysicalActivityPatient]:
    """Get patients with specific medical conditions"""
    query = db.query(PhysicalActivityPatient).filter(PhysicalActivityPatient.ativo == True)
    
    condition_filters = []
    for condition in conditions:
        condition_filters.append(PhysicalActivityPatient.diagnostico_principal.ilike(f"%{condition}%"))
        condition_filters.append(PhysicalActivityPatient.comorbidades.ilike(f"%{condition}%"))
    
    if condition_filters:
        query = query.filter(or_(*condition_filters))
    
    return query.all()