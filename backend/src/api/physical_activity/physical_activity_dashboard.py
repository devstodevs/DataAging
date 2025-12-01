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
    """Obtém resumo geral do dashboard (total avaliado, % conformidade OMS, média de horas sedentárias)"""
    return PhysicalActivityDashboardService.get_summary(db)


@router.get("/critical-patients")
def get_critical_patients(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    """Obtém pacientes com risco sedentário crítico (>10 horas/dia)"""
    return PhysicalActivityDashboardService.get_critical_patients(db)


@router.get("/activity-distribution")
def get_activity_distribution(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Obtém distribuição por intensidade de atividade (leve, moderada, vigorosa)"""
    return PhysicalActivityDashboardService.get_activity_distribution(db)


@router.get("/sedentary-by-age")
def get_sedentary_by_age(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    """Obtém horas sedentárias por faixa etária (60-70, 71-80, 81+)"""
    return PhysicalActivityDashboardService.get_sedentary_by_age(db)


@router.get("/sedentary-trend")
def get_sedentary_trend(
    months: int = Query(12, ge=1, le=24, description="Número de meses para análise de tendência"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, List[Dict[str, Any]]]:
    """Obtém tendência sedentária ao longo do tempo para diabéticos e hipertensos"""
    return PhysicalActivityDashboardService.get_sedentary_trend(db, months)


@router.get("/who-compliance")
def get_who_compliance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Obtém dados de conformidade OMS (conformes vs não conformes)"""
    return PhysicalActivityDashboardService.get_who_compliance(db)


@router.get("/all-patients")
def get_all_patients_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    """Obtém resumo de todos os pacientes com sua última avaliação"""
    return PhysicalActivityDashboardService.get_all_patients_summary(db)