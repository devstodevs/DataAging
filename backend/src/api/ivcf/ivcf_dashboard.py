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

router = APIRouter()


@router.get("/ivcf-dashboard/ivcf-summary", response_model=IVCFSummary)
def get_ivcf_summary(db: Session = Depends(get_db)):
    """
    Get IVCF summary statistics.
    
    **Returns:**
    - Summary data including total elderly, percentages, average score, and critical patients
    """
    return IVCFDashboardService.get_ivcf_summary(db)


@router.get("/ivcf-dashboard/ivcf-by-domain", response_model=DomainDistributionResponse)
def get_domain_distribution(
    period_from: Optional[date] = Query(None, description="Start date filter"),
    period_to: Optional[date] = Query(None, description="End date filter"),
    region: Optional[str] = Query(None, description="Region filter"),
    health_unit_id: Optional[int] = Query(None, description="Health unit ID filter"),
    age_range: Optional[str] = Query(None, description="Age range filter (60-70, 71-80, 81+)"),
    classification: Optional[str] = Query(None, description="Classification filter (Robusto, Em Risco, Frágil)"),
    db: Session = Depends(get_db)
):
    """
    Get domain distribution for spider chart.
    
    **Query Parameters:**
    - period_from: Start date filter
    - period_to: End date filter
    - region: Region filter (must be valid Curitiba region)
    - health_unit_id: Health unit ID filter
    - age_range: Age range filter (60-70, 71-80, 81+)
    - classification: Classification filter (Robusto, Em Risco, Frágil)
    
    **Returns:**
    - Domain distribution data with chart configuration and applied filters
    
    **Raises:**
    - 422: Invalid filters provided
    """
    return IVCFDashboardService.get_domain_distribution(
        db, period_from, period_to, region, health_unit_id, age_range, classification
    )


@router.get("/ivcf-dashboard/ivcf-by-region", response_model=RegionAverageResponse)
def get_region_averages(
    period_from: Optional[date] = Query(None, description="Start date filter"),
    period_to: Optional[date] = Query(None, description="End date filter"),
    db: Session = Depends(get_db)
):
    """
    Get average scores by region.
    
    **Query Parameters:**
    - period_from: Start date filter
    - period_to: End date filter
    
    **Returns:**
    - Region average data with applied filters
    """
    return IVCFDashboardService.get_region_averages(db, period_from, period_to)


@router.get("/ivcf-dashboard/ivcf-evolution", response_model=MonthlyEvolutionResponse)
def get_monthly_evolution(
    months_back: int = Query(6, ge=1, le=24, description="Number of months to look back"),
    db: Session = Depends(get_db)
):
    """
    Get monthly evolution for the last N months.
    
    **Query Parameters:**
    - months_back: Number of months to look back (default: 6, range: 1-24)
    
    **Returns:**
    - Monthly evolution data with applied filters
    
    **Raises:**
    - 422: Invalid months_back value
    """
    return IVCFDashboardService.get_monthly_evolution(db, months_back)


@router.get("/ivcf-dashboard/critical-patients", response_model=CriticalPatientsResponse)
def get_critical_patients(
    pontuacao_minima: int = Query(20, ge=0, le=40, description="Minimum score for critical patients"),
    db: Session = Depends(get_db)
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
def get_all_patients(db: Session = Depends(get_db)):
    """
    Get all patients with their evaluations.
    
    **Returns:**
    - All patients data
    """
    return IVCFDashboardService.get_all_patients(db)


@router.get("/ivcf-dashboard/curitiba-regions")
def get_curitiba_regions():
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
    db: Session = Depends(get_db)
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
    classification: Optional[str] = Query(None, description="Classification to validate")
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
