from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from db.base import get_db
from services.physical_activity.physical_activity_dashboard_service import PhysicalActivityDashboardService
from api.auth.auth import get_current_user
from models.user.user import User

router = APIRouter()


@router.get("/summary")
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Get general dashboard summary (total evaluated, % WHO compliance, average sedentary hours)"""
    return PhysicalActivityDashboardService.get_summary(db)


@router.get("/critical-patients")
def get_critical_patients(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    """Get patients with critical sedentary risk (>10 hours/day)"""
    return PhysicalActivityDashboardService.get_critical_patients(db)


@router.get("/activity-distribution")
def get_activity_distribution(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Get distribution by activity intensity (light, moderate, vigorous)"""
    return PhysicalActivityDashboardService.get_activity_distribution(db)


@router.get("/sedentary-by-age")
def get_sedentary_by_age(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    """Get sedentary hours by age range (60-70, 71-80, 81+)"""
    return PhysicalActivityDashboardService.get_sedentary_by_age(db)


@router.get("/sedentary-trend")
def get_sedentary_trend(
    months: int = Query(12, ge=1, le=24, description="Número de meses para análise de tendência"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, List[Dict[str, Any]]]:
    """Get sedentary trend over time for diabetics and hypertensives"""
    return PhysicalActivityDashboardService.get_sedentary_trend(db, months)


@router.get("/who-compliance")
def get_who_compliance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Get WHO compliance data (compliant vs non-compliant)"""
    return PhysicalActivityDashboardService.get_who_compliance(db)


@router.get("/all-patients")
def get_all_patients_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    """Get summary of all patients with their latest evaluation"""
    return PhysicalActivityDashboardService.get_all_patients_summary(db)