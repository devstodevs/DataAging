from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from db.base import get_db
from schemas.ivcf.ivcf_dashboard import (
    DomainDistributionResponse,
    IVCFSummary,
    RegionAverageResponse,
    MonthlyEvolutionResponse,
    CriticalPatientsResponse,
    FragileElderlyPercentageResponse
)
from services.ivcf.ivcf_dashboard_service import IVCFDashboardService
from api.auth.auth import get_current_user
from models.user.user import User

router = APIRouter()


@router.get("/ivcf-dashboard/ivcf-summary", response_model=IVCFSummary)
def get_ivcf_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtém estatísticas resumidas do IVCF.
    
    **Retorna:**
    - Dados resumidos incluindo total de idosos, percentuais, pontuação média e pacientes críticos
    """
    return IVCFDashboardService.get_ivcf_summary(db)


@router.get("/ivcf-dashboard/ivcf-by-domain", response_model=DomainDistributionResponse)
def get_domain_distribution(
    period_from: Optional[date] = Query(None, description="Filtro de data inicial"),
    period_to: Optional[date] = Query(None, description="Filtro de data final"),
    region: Optional[str] = Query(None, description="Filtro de região"),
    health_unit_id: Optional[int] = Query(None, description="Filtro de ID da unidade de saúde"),
    age_range: Optional[str] = Query(None, description="Filtro de faixa etária (60-70, 71-80, 81+)"),
    classification: Optional[str] = Query(None, description="Filtro de classificação (Robusto, Em Risco, Frágil)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtém a distribuição por domínios para gráfico de aranha.
    
    **Parâmetros de Query:**
    - period_from: Filtro de data inicial
    - period_to: Filtro de data final
    - region: Filtro de região (deve ser uma região válida de Curitiba)
    - health_unit_id: Filtro de ID da unidade de saúde
    - age_range: Filtro de faixa etária (60-70, 71-80, 81+)
    - classification: Filtro de classificação (Robusto, Em Risco, Frágil)
    
    **Retorna:**
    - Dados de distribuição por domínios com configuração do gráfico e filtros aplicados
    
    **Raises:**
    - 422: Filtros inválidos fornecidos
    """
    return IVCFDashboardService.get_domain_distribution(
        db, period_from, period_to, region, health_unit_id, age_range, classification
    )


@router.get("/ivcf-dashboard/ivcf-by-region", response_model=RegionAverageResponse)
def get_region_averages(
    period_from: Optional[date] = Query(None, description="Filtro de data inicial"),
    period_to: Optional[date] = Query(None, description="Filtro de data final"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtém pontuações médias por região.
    
    **Parâmetros de Query:**
    - period_from: Filtro de data inicial
    - period_to: Filtro de data final
    
    **Retorna:**
    - Dados de médias por região com filtros aplicados
    """
    return IVCFDashboardService.get_region_averages(db, period_from, period_to)


@router.get("/ivcf-dashboard/ivcf-evolution", response_model=MonthlyEvolutionResponse)
def get_monthly_evolution(
    months_back: int = Query(6, ge=1, le=24, description="Número de meses para retroceder"),
    from_last_evaluation: bool = Query(False, description="Iniciar a partir da data da última avaliação"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtém a evolução mensal dos últimos N meses.
    
    **Parâmetros de Query:**
    - months_back: Número de meses para retroceder (padrão: 6, intervalo: 1-24)
    - from_last_evaluation: Iniciar a partir da data da última avaliação (padrão: False)
    
    **Retorna:**
    - Dados de evolução mensal com filtros aplicados
    
    **Raises:**
    - 422: Valor inválido de months_back
    """
    return IVCFDashboardService.get_monthly_evolution(db, months_back, from_last_evaluation)


@router.get("/ivcf-dashboard/critical-patients", response_model=CriticalPatientsResponse)
def get_critical_patients(
    pontuacao_minima: int = Query(20, ge=0, le=40, description="Minimum score for critical patients"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get patients with critical scores.
    
    **Query Parameters:**
    - pontuacao_minima: Minimum score for critical patients (default: 20, range: 0-40)
    
    **Returns:**
    - Critical patients data with applied filters
    
    **Raises:**
    - 422: Invalid pontuacao_minima value
    """
    return IVCFDashboardService.get_critical_patients(db, pontuacao_minima)


@router.get("/ivcf-dashboard/all-patients", response_model=CriticalPatientsResponse)
def get_all_patients(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all patients with their evaluations.
    
    **Returns:**
    - All patients data
    """
    return IVCFDashboardService.get_all_patients(db)


@router.get("/ivcf-dashboard/curitiba-regions")
def get_curitiba_regions(
    current_user: User = Depends(get_current_user)
):
    """
    Get list of valid Curitiba regions.
    
    **Returns:**
    - List of valid region names
    """
    regions = IVCFDashboardService.get_curitiba_regions()
    return {"regions": regions}


@router.get("/ivcf-dashboard/fragile-percentage", response_model=FragileElderlyPercentageResponse)
def get_fragile_elderly_percentage(
    period_from: Optional[date] = Query(None, description="Start date filter"),
    period_to: Optional[date] = Query(None, description="End date filter"),
    region: Optional[str] = Query(None, description="Region filter"),
    health_unit_id: Optional[int] = Query(None, description="Health unit ID filter"),
    age_range: Optional[str] = Query(None, description="Age range filter (60-70, 71-80, 81+)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get percentage of fragile elderly with filters.
    
    **Query Parameters:**
    - period_from: Start date filter
    - period_to: End date filter
    - region: Region filter (must be valid Curitiba region)
    - health_unit_id: Health unit ID filter
    - age_range: Age range filter (60-70, 71-80, 81+)
    
    **Returns:**
    - Fragile elderly percentage data with applied filters
    
    **Raises:**
    - 422: Invalid filters provided
    """
    return IVCFDashboardService.get_fragile_elderly_percentage(
        db, period_from, period_to, region, health_unit_id, age_range
    )


@router.get("/ivcf-dashboard/validate-filters")
def validate_filters(
    region: Optional[str] = Query(None, description="Region to validate"),
    age_range: Optional[str] = Query(None, description="Age range to validate"),
    classification: Optional[str] = Query(None, description="Classification to validate"),
    current_user: User = Depends(get_current_user)
):
    """
    Validate dashboard filters.
    
    **Query Parameters:**
    - region: Region to validate
    - age_range: Age range to validate
    - classification: Classification to validate
    
    **Returns:**
    - Validation results
    """
    errors = IVCFDashboardService.validate_filters(region, age_range, classification)
    
    if errors:
        return {
            "valid": False,
            "errors": errors
        }
    
    return {
        "valid": True,
        "errors": {}
    }
