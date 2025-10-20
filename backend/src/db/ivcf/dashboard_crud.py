from sqlalchemy.orm import Session
from sqlalchemy import and_, func, desc
from typing import Dict, Any, Optional
from datetime import date, datetime, timedelta
from models.ivcf.ivcf_evaluation import IVCFEvaluation
from models.ivcf.ivcf_patient import IVCFPatient
from models.ivcf.health_unit import HealthUnit


def get_ivcf_summary(db: Session) -> Dict[str, Any]:
    """Get IVCF summary statistics"""
    
    # Get total evaluations count
    total_evaluations = db.query(IVCFEvaluation).join(
        IVCFPatient, IVCFEvaluation.patient_id == IVCFPatient.id
    ).filter(IVCFPatient.ativo == True).count()
    
    if total_evaluations == 0:
        return {
            "total_elderly": 0,
            "fragile_percentage": 0.0,
            "risk_percentage": 0.0,
            "robust_percentage": 0.0,
            "average_score": 0.0,
            "critical_patients": 0
        }
    
    # Get classification counts
    classification_counts = db.query(
        IVCFEvaluation.classificacao,
        func.count(IVCFEvaluation.id).label('count')
    ).join(
        IVCFPatient, IVCFEvaluation.patient_id == IVCFPatient.id
    ).filter(
        IVCFPatient.ativo == True
    ).group_by(IVCFEvaluation.classificacao).all()
    
    # Calculate percentages
    fragile_count = 0
    risk_count = 0
    robust_count = 0
    
    for classification, count in classification_counts:
        if classification == "Frágil":
            fragile_count = count
        elif classification == "Em Risco":
            risk_count = count
        elif classification == "Robusto":
            robust_count = count
    
    fragile_percentage = round((fragile_count / total_evaluations) * 100, 1)
    risk_percentage = round((risk_count / total_evaluations) * 100, 1)
    robust_percentage = round((robust_count / total_evaluations) * 100, 1)
    
    # Get average score
    avg_score_result = db.query(
        func.avg(IVCFEvaluation.pontuacao_total).label('average_score')
    ).join(
        IVCFPatient, IVCFEvaluation.patient_id == IVCFPatient.id
    ).filter(IVCFPatient.ativo == True).first()
    
    average_score = round(avg_score_result.average_score or 0, 1)
    
    # Get critical patients count (Frágil with score >= 20)
    critical_patients = db.query(IVCFEvaluation).join(
        IVCFPatient, IVCFEvaluation.patient_id == IVCFPatient.id
    ).filter(
        and_(
            IVCFPatient.ativo == True,
            IVCFEvaluation.classificacao == "Frágil",
            IVCFEvaluation.pontuacao_total >= 20
        )
    ).count()
    
    return {
        "total_elderly": total_evaluations,
        "fragile_percentage": fragile_percentage,
        "risk_percentage": risk_percentage,
        "robust_percentage": robust_percentage,
        "average_score": average_score,
        "critical_patients": critical_patients
    }


def get_dashboard_filters_applied(
    period_from: Optional[date] = None,
    period_to: Optional[date] = None,
    region: Optional[str] = None,
    health_unit_id: Optional[int] = None,
    age_range: Optional[str] = None,
    classification: Optional[str] = None
) -> Dict[str, Any]:
    """Get applied filters information"""
    
    filters = {}
    
    if period_from and period_to:
        filters["period"] = f"{period_from.strftime('%Y-%m-%d')} to {period_to.strftime('%Y-%m-%d')}"
    elif period_from:
        filters["period"] = f"from {period_from.strftime('%Y-%m-%d')}"
    elif period_to:
        filters["period"] = f"until {period_to.strftime('%Y-%m-%d')}"
    
    if region:
        filters["region"] = region
    
    if health_unit_id:
        filters["health_unit_id"] = health_unit_id
    
    if age_range:
        filters["age_range"] = age_range
    
    if classification:
        filters["classification"] = classification
    
    return filters


def get_total_patients_with_filters(
    db: Session,
    period_from: Optional[date] = None,
    period_to: Optional[date] = None,
    region: Optional[str] = None,
    health_unit_id: Optional[int] = None,
    age_range: Optional[str] = None,
    classification: Optional[str] = None
) -> int:
    """Get total patients count with applied filters"""
    
    query = db.query(IVCFEvaluation).join(
        IVCFPatient, IVCFEvaluation.patient_id == IVCFPatient.id
    ).join(
        HealthUnit, IVCFPatient.unidade_saude_id == HealthUnit.id
    ).filter(IVCFPatient.ativo == True)
    
    # Apply filters
    if period_from:
        query = query.filter(IVCFEvaluation.data_avaliacao >= period_from)
    
    if period_to:
        query = query.filter(IVCFEvaluation.data_avaliacao <= period_to)
    
    if region:
        query = query.filter(HealthUnit.regiao == region)
    
    if health_unit_id:
        query = query.filter(IVCFPatient.unidade_saude_id == health_unit_id)
    
    if age_range:
        if age_range == "60-70":
            query = query.filter(and_(IVCFPatient.idade >= 60, IVCFPatient.idade <= 70))
        elif age_range == "71-80":
            query = query.filter(and_(IVCFPatient.idade >= 71, IVCFPatient.idade <= 80))
        elif age_range == "81+":
            query = query.filter(IVCFPatient.idade >= 81)
    
    if classification:
        query = query.filter(IVCFEvaluation.classificacao == classification)
    
    return query.count()


def get_curitiba_regions() -> list:
    """Get list of Curitiba regions"""
    return [
        "Centro",
        "Norte",
        "Sul", 
        "Leste",
        "Oeste",
        "Cajuru",
        "Boqueirão",
        "Pinheirinho",
        "Santa Felicidade",
        "Tatuquara",
        "Bairro Novo",
        "CIC",
        "Fazendinha",
        "Portão",
        "Boavista"
    ]


def validate_curitiba_region(region: str) -> bool:
    """Validate if region is a valid Curitiba region"""
    valid_regions = get_curitiba_regions()
    return region in valid_regions


def validate_age_range(age_range: str) -> bool:
    """Validate age range format"""
    valid_ranges = ["60-70", "71-80", "81+"]
    return age_range in valid_ranges


def validate_classification(classification: str) -> bool:
    """Validate classification"""
    valid_classifications = ["Robusto", "Em Risco", "Frágil"]
    return classification in valid_classifications
