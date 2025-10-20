from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from models.health_unit import HealthUnit


def create_health_unit(db: Session, health_unit_data: dict) -> HealthUnit:
    """Create a new health unit"""
    db_health_unit = HealthUnit(**health_unit_data)
    db.add(db_health_unit)
    db.commit()
    db.refresh(db_health_unit)
    return db_health_unit


def get_health_unit(db: Session, health_unit_id: int) -> Optional[HealthUnit]:
    """Get a health unit by ID"""
    return db.query(HealthUnit).filter(HealthUnit.id == health_unit_id).first()


def get_health_units(db: Session, skip: int = 0, limit: int = 100, active_only: bool = True) -> List[HealthUnit]:
    """Get all health units with pagination"""
    query = db.query(HealthUnit)
    
    if active_only:
        query = query.filter(HealthUnit.ativo == True)
    
    return query.offset(skip).limit(limit).all()


def get_health_unit_by_name(db: Session, nome: str) -> Optional[HealthUnit]:
    """Get a health unit by name"""
    return db.query(HealthUnit).filter(HealthUnit.nome == nome).first()


def get_health_units_by_region(db: Session, regiao: str) -> List[HealthUnit]:
    """Get health units by region"""
    return db.query(HealthUnit).filter(
        and_(HealthUnit.regiao == regiao, HealthUnit.ativo == True)
    ).all()


def update_health_unit(db: Session, health_unit_id: int, health_unit_data: dict) -> Optional[HealthUnit]:
    """Update a health unit"""
    db_health_unit = db.query(HealthUnit).filter(HealthUnit.id == health_unit_id).first()
    
    if not db_health_unit:
        return None
    
    for key, value in health_unit_data.items():
        if value is not None:
            setattr(db_health_unit, key, value)
    
    db.commit()
    db.refresh(db_health_unit)
    return db_health_unit


def delete_health_unit(db: Session, health_unit_id: int) -> bool:
    """Delete a health unit (soft delete by setting ativo=False)"""
    db_health_unit = db.query(HealthUnit).filter(HealthUnit.id == health_unit_id).first()
    
    if not db_health_unit:
        return False
    
    db_health_unit.ativo = False
    db.commit()
    return True


def hard_delete_health_unit(db: Session, health_unit_id: int) -> bool:
    """Hard delete a health unit"""
    db_health_unit = db.query(HealthUnit).filter(HealthUnit.id == health_unit_id).first()
    
    if not db_health_unit:
        return False
    
    db.delete(db_health_unit)
    db.commit()
    return True
