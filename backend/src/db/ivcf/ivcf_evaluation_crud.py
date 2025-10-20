from sqlalchemy.orm import Session
from sqlalchemy import and_, func, desc, case
from typing import List, Optional, Dict, Any
from datetime import date, datetime
from models.ivcf.ivcf_evaluation import IVCFEvaluation
from models.ivcf.ivcf_patient import IVCFPatient
from models.ivcf.health_unit import HealthUnit


def create_ivcf_evaluation(db: Session, evaluation_data: dict) -> IVCFEvaluation:
    """Create a new IVCF evaluation"""
    db_evaluation = IVCFEvaluation(**evaluation_data)
    db.add(db_evaluation)
    db.commit()
    db.refresh(db_evaluation)
    return db_evaluation


def get_ivcf_evaluation(db: Session, evaluation_id: int) -> Optional[IVCFEvaluation]:
    """Get an IVCF evaluation by ID"""
    return db.query(IVCFEvaluation).filter(IVCFEvaluation.id == evaluation_id).first()


def get_ivcf_evaluation_by_patient(db: Session, patient_id: int) -> Optional[IVCFEvaluation]:
    """Get an IVCF evaluation by patient ID (only one evaluation per patient allowed)"""
    return db.query(IVCFEvaluation).filter(IVCFEvaluation.patient_id == patient_id).first()


def get_ivcf_evaluations(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    patient_id: Optional[int] = None,
    period_from: Optional[date] = None,
    period_to: Optional[date] = None,
    classificacao: Optional[str] = None
) -> List[IVCFEvaluation]:
    """Get IVCF evaluations with pagination and filters"""
    query = db.query(IVCFEvaluation)
    
    if patient_id:
        query = query.filter(IVCFEvaluation.patient_id == patient_id)
    
    if period_from:
        query = query.filter(IVCFEvaluation.data_avaliacao >= period_from)
    
    if period_to:
        query = query.filter(IVCFEvaluation.data_avaliacao <= period_to)
    
    if classificacao:
        query = query.filter(IVCFEvaluation.classificacao == classificacao)
    
    return query.order_by(desc(IVCFEvaluation.data_avaliacao)).offset(skip).limit(limit).all()


def get_critical_patients(db: Session, pontuacao_minima: int = 20) -> List[Dict[str, Any]]:
    """Get patients with critical scores (Frágil classification)"""
    query = db.query(
        IVCFPatient.id.label('patient_id'),
        IVCFPatient.nome_completo,
        IVCFPatient.idade,
        IVCFPatient.bairro,
        HealthUnit.nome.label('unidade_saude'),
        IVCFEvaluation.pontuacao_total,
        IVCFEvaluation.classificacao,
        IVCFEvaluation.comorbidades,
        IVCFEvaluation.data_avaliacao.label('data_ultima_avaliacao')
    ).join(
        IVCFEvaluation, IVCFPatient.id == IVCFEvaluation.patient_id
    ).join(
        HealthUnit, IVCFPatient.unidade_saude_id == HealthUnit.id
    ).filter(
        and_(
            IVCFPatient.ativo == True,
            IVCFEvaluation.pontuacao_total >= pontuacao_minima,
            IVCFEvaluation.classificacao == "Frágil"
        )
    ).order_by(desc(IVCFEvaluation.pontuacao_total))
    
    return [dict(row._mapping) for row in query.all()]


def get_all_patients(db: Session) -> List[Dict[str, Any]]:
    """Get all patients with their evaluations"""
    query = db.query(
        IVCFPatient.id.label('patient_id'),
        IVCFPatient.nome_completo,
        IVCFPatient.idade,
        IVCFPatient.bairro,
        HealthUnit.nome.label('unidade_saude'),
        IVCFEvaluation.pontuacao_total,
        IVCFEvaluation.classificacao,
        IVCFEvaluation.comorbidades,
        IVCFEvaluation.data_avaliacao.label('data_ultima_avaliacao')
    ).join(
        IVCFEvaluation, IVCFPatient.id == IVCFEvaluation.patient_id
    ).join(
        HealthUnit, IVCFPatient.unidade_saude_id == HealthUnit.id
    ).filter(
        IVCFPatient.ativo == True
    ).order_by(desc(IVCFEvaluation.data_avaliacao))
    
    return [dict(row._mapping) for row in query.all()]


def get_domain_distribution(
    db: Session,
    period_from: Optional[date] = None,
    period_to: Optional[date] = None,
    region: Optional[str] = None,
    health_unit_id: Optional[int] = None,
    age_range: Optional[str] = None,
    classification: Optional[str] = None
) -> List[Dict[str, Any]]:
    """Get domain distribution with filters"""
    
    # Base query with joins
    query = db.query(IVCFEvaluation).join(
        IVCFPatient, IVCFEvaluation.patient_id == IVCFPatient.id
    ).join(
        HealthUnit, IVCFPatient.unidade_saude_id == HealthUnit.id
    ).filter(
        IVCFPatient.ativo == True
    )
    
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
    
    # Get all evaluations matching filters
    evaluations = query.all()
    
    if not evaluations:
        return []
    
    # Calculate domain averages
    domains = [
        ("Idade", "dominio_idade"),
        ("Comorbidades", "dominio_comorbidades"),
        ("Comunicação", "dominio_comunicacao"),
        ("Mobilidade", "dominio_mobilidade"),
        ("Humor", "dominio_humor"),
        ("Cognição", "dominio_cognicao"),
        ("AVD", "dominio_avd"),
        ("Autopercepção", "dominio_autopercepcao")
    ]
    
    result = []
    patient_count = len(evaluations)
    
    for domain_name, domain_field in domains:
        scores = [getattr(eval, domain_field) for eval in evaluations]
        avg_score = round(sum(scores) / len(scores), 1)
        min_score = min(scores)
        max_score = max(scores)
        
        result.append({
            "domain": domain_name,
            "average_score": avg_score,
            "min_score": min_score,
            "max_score": max_score,
            "patient_count": patient_count
        })
    
    return result


def get_region_averages(
    db: Session,
    period_from: Optional[date] = None,
    period_to: Optional[date] = None
) -> List[Dict[str, Any]]:
    """Get average scores by region"""
    
    query = db.query(
        HealthUnit.regiao,
        HealthUnit.bairro,
        func.avg(IVCFEvaluation.pontuacao_total).label('average_score'),
        func.count(IVCFEvaluation.id).label('patient_count'),
        func.sum(case((IVCFEvaluation.classificacao == "Frágil", 1), else_=0)).label('fragile_count'),
        func.sum(case((IVCFEvaluation.classificacao == "Em Risco", 1), else_=0)).label('risk_count'),
        func.sum(case((IVCFEvaluation.classificacao == "Robusto", 1), else_=0)).label('robust_count')
    ).join(
        IVCFPatient, IVCFEvaluation.patient_id == IVCFPatient.id
    ).join(
        HealthUnit, IVCFPatient.unidade_saude_id == HealthUnit.id
    ).filter(
        IVCFPatient.ativo == True
    )
    
    if period_from:
        query = query.filter(IVCFEvaluation.data_avaliacao >= period_from)
    
    if period_to:
        query = query.filter(IVCFEvaluation.data_avaliacao <= period_to)
    
    query = query.group_by(HealthUnit.regiao, HealthUnit.bairro)
    
    return [dict(row._mapping) for row in query.all()]


def get_monthly_evolution(
    db: Session,
    months_back: int = 6
) -> List[Dict[str, Any]]:
    """Get monthly evolution for the last N months"""
    
    # Calculate start date
    start_date = date.today().replace(day=1)
    for _ in range(months_back):
        if start_date.month == 1:
            start_date = start_date.replace(year=start_date.year - 1, month=12)
        else:
            start_date = start_date.replace(month=start_date.month - 1)
    
    query = db.query(
        func.strftime('%Y-%m', IVCFEvaluation.data_avaliacao).label('month_year'),
        func.strftime('%Y', IVCFEvaluation.data_avaliacao).label('year'),
        func.strftime('%m', IVCFEvaluation.data_avaliacao).label('month'),
        func.sum(case((IVCFEvaluation.classificacao == "Robusto", 1), else_=0)).label('robust'),
        func.sum(case((IVCFEvaluation.classificacao == "Em Risco", 1), else_=0)).label('risk'),
        func.sum(case((IVCFEvaluation.classificacao == "Frágil", 1), else_=0)).label('fragile'),
        func.count(IVCFEvaluation.id).label('total')
    ).join(
        IVCFPatient, IVCFEvaluation.patient_id == IVCFPatient.id
    ).filter(
        and_(
            IVCFPatient.ativo == True,
            IVCFEvaluation.data_avaliacao >= start_date
        )
    ).group_by(
        func.strftime('%Y-%m', IVCFEvaluation.data_avaliacao)
    ).order_by(
        func.strftime('%Y-%m', IVCFEvaluation.data_avaliacao)
    )
    
    results = []
    for row in query.all():
        month_names = {
            "01": "Jan", "02": "Fev", "03": "Mar", "04": "Abr",
            "05": "Mai", "06": "Jun", "07": "Jul", "08": "Ago",
            "09": "Set", "10": "Out", "11": "Nov", "12": "Dez"
        }
        
        results.append({
            "month": month_names.get(row.month, row.month),
            "year": int(row.year),
            "robust": row.robust or 0,
            "risk": row.risk or 0,
            "fragile": row.fragile or 0,
            "total": row.total or 0
        })
    
    return results


def update_ivcf_evaluation(db: Session, evaluation_id: int, evaluation_data: dict) -> Optional[IVCFEvaluation]:
    """Update an IVCF evaluation"""
    db_evaluation = db.query(IVCFEvaluation).filter(IVCFEvaluation.id == evaluation_id).first()
    
    if not db_evaluation:
        return None
    
    for key, value in evaluation_data.items():
        if value is not None:
            setattr(db_evaluation, key, value)
    
    db.commit()
    db.refresh(db_evaluation)
    return db_evaluation


def delete_ivcf_evaluation(db: Session, evaluation_id: int) -> bool:
    """Delete an IVCF evaluation"""
    db_evaluation = db.query(IVCFEvaluation).filter(IVCFEvaluation.id == evaluation_id).first()
    
    if not db_evaluation:
        return False
    
    db.delete(db_evaluation)
    db.commit()
    return True
