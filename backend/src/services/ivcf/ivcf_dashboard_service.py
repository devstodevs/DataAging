from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Dict, Any, Optional
from datetime import date
from schemas.ivcf.ivcf_dashboard import (
    DomainDistributionResponse,
    ChartConfig,
    FiltersApplied,
    IVCFSummary,
    RegionAverageResponse,
    MonthlyEvolutionResponse,
    CriticalPatientsResponse,
    FragileElderlyPercentageResponse,
    DomainDistribution,
    RegionAverage,
    MonthlyEvolution,
    CriticalPatient
)
from db.ivcf import ivcf_dashboard_crud, ivcf_evaluation_crud


class IVCFDashboardService:
    """Service layer for dashboard business logic"""
    
    @staticmethod
    def get_ivcf_summary(db: Session) -> IVCFSummary:
        """
        Get IVCF summary statistics.
        
        Args:
            db: Database session
            
        Returns:
            IVCFSummary object
        """
        summary_data = ivcf_dashboard_crud.get_ivcf_summary(db)
        return IVCFSummary(**summary_data)
    
    @staticmethod
    def get_domain_distribution(
        db: Session,
        period_from: Optional[date] = None,
        period_to: Optional[date] = None,
        region: Optional[str] = None,
        health_unit_id: Optional[int] = None,
        age_range: Optional[str] = None,
        classification: Optional[str] = None
    ) -> DomainDistributionResponse:
        """
        Get domain distribution with filters.
        
        Args:
            db: Database session
            period_from: Start date filter
            period_to: End date filter
            region: Region filter
            health_unit_id: Health unit filter
            age_range: Age range filter
            classification: Classification filter
            
        Returns:
            DomainDistributionResponse object
            
        Raises:
            HTTPException: If invalid filters provided
        """
        # Validate filters
        if region and not ivcf_dashboard_crud.validate_curitiba_region(region):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Região '{region}' não é uma região válida de Curitiba"
            )
        
        if age_range and not ivcf_dashboard_crud.validate_age_range(age_range):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Faixa etária '{age_range}' não é válida. Use: 60-70, 71-80, 81+"
            )
        
        if classification and not ivcf_dashboard_crud.validate_classification(classification):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Classificação '{classification}' não é válida. Use: Robusto, Em Risco, Frágil"
            )
        
        # Get domain distribution data
        domain_data = ivcf_evaluation_crud.get_domain_distribution(
            db, period_from, period_to, region, health_unit_id, age_range, classification
        )
        
        # Get total patients with filters
        total_patients = ivcf_dashboard_crud.get_total_patients_with_filters(
            db, period_from, period_to, region, health_unit_id, age_range, classification
        )
        
        # Get applied filters
        filters_applied = ivcf_dashboard_crud.get_dashboard_filters_applied(
            period_from, period_to, region, health_unit_id, age_range, classification
        )
        filters_applied["total_patients"] = total_patients
        
        # Create response
        domain_distributions = [DomainDistribution(**data) for data in domain_data]
        chart_config = ChartConfig()
        filters = FiltersApplied(**filters_applied)
        
        return DomainDistributionResponse(
            domains=domain_distributions,
            chart_config=chart_config,
            filters_applied=filters
        )
    
    @staticmethod
    def get_region_averages(
        db: Session,
        period_from: Optional[date] = None,
        period_to: Optional[date] = None
    ) -> RegionAverageResponse:
        """
        Get average scores by region.
        
        Args:
            db: Database session
            period_from: Start date filter
            period_to: End date filter
            
        Returns:
            RegionAverageResponse object
        """
        # Get region average data
        region_data = ivcf_evaluation_crud.get_region_averages(db, period_from, period_to)
        
        # Get applied filters
        filters_applied = ivcf_dashboard_crud.get_dashboard_filters_applied(
            period_from, period_to
        )
        filters_applied["total_patients"] = sum(item["patient_count"] for item in region_data)
        
        # Create response
        region_averages = [RegionAverage(**data) for data in region_data]
        filters = FiltersApplied(**filters_applied)
        
        return RegionAverageResponse(
            regions=region_averages,
            filters_applied=filters
        )
    
    @staticmethod
    def get_monthly_evolution(
        db: Session,
        months_back: int = 6,
        from_last_evaluation: bool = False
    ) -> MonthlyEvolutionResponse:
        """
        Get monthly evolution for the last N months.
        
        Args:
            db: Database session
            months_back: Number of months to look back
            from_last_evaluation: If True, starts from the last evaluation date
            
        Returns:
            MonthlyEvolutionResponse object
            
        Raises:
            HTTPException: If months_back is invalid
        """
        if months_back < 1 or months_back > 24:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Número de meses deve estar entre 1 e 24"
            )
        
        # Get monthly evolution data
        evolution_data = ivcf_evaluation_crud.get_monthly_evolution(db, months_back, from_last_evaluation)
        
        # Get applied filters
        filters_applied = ivcf_dashboard_crud.get_dashboard_filters_applied()
        filters_applied["total_patients"] = sum(item["total"] for item in evolution_data)
        
        if from_last_evaluation:
            filters_applied["period"] = f"Últimos {months_back} meses a partir da última avaliação"
        else:
            filters_applied["period"] = f"Últimos {months_back} meses"
        
        # Create response
        monthly_evolutions = [MonthlyEvolution(**data) for data in evolution_data]
        filters = FiltersApplied(**filters_applied)
        
        return MonthlyEvolutionResponse(
            evolution=monthly_evolutions,
            filters_applied=filters
        )
    
    @staticmethod
    def get_critical_patients(
        db: Session,
        pontuacao_minima: int = 20
    ) -> CriticalPatientsResponse:
        """
        Get patients with critical scores.
        
        Args:
            db: Database session
            pontuacao_minima: Minimum score for critical patients
            
        Returns:
            CriticalPatientsResponse object
            
        Raises:
            HTTPException: If pontuacao_minima is invalid
        """
        if pontuacao_minima < 0 or pontuacao_minima > 40:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Pontuação mínima deve estar entre 0 e 40"
            )
        
        # Get critical patients data
        critical_data = ivcf_evaluation_crud.get_critical_patients(db, pontuacao_minima)
        
        # Get applied filters
        filters_applied = ivcf_dashboard_crud.get_dashboard_filters_applied()
        filters_applied["total_patients"] = len(critical_data)
        filters_applied["classification"] = "Frágil"
        
        # Create response
        critical_patients = [CriticalPatient(**data) for data in critical_data]
        filters = FiltersApplied(**filters_applied)
        
        return CriticalPatientsResponse(
            critical_patients=critical_patients,
            total_critical=len(critical_data),
            filters_applied=filters
        )
    
    @staticmethod
    def get_all_patients(db: Session) -> CriticalPatientsResponse:
        """
        Get all patients with their evaluations.
        
        Args:
            db: Database session
            
        Returns:
            CriticalPatientsResponse object with all patients
        """
        # Get all patients data
        from db.ivcf.ivcf_evaluation_crud import get_all_patients
        all_patients_data = get_all_patients(db)
        
        # Get applied filters
        filters_applied = ivcf_dashboard_crud.get_dashboard_filters_applied()
        filters_applied["total_patients"] = len(all_patients_data)
        
        # Create response
        all_patients = [CriticalPatient(**data) for data in all_patients_data]
        filters = FiltersApplied(**filters_applied)
        
        return CriticalPatientsResponse(
            critical_patients=all_patients,
            total_critical=len(all_patients_data),
            filters_applied=filters
        )
    
    @staticmethod
    def get_curitiba_regions() -> list:
        """
        Get list of valid Curitiba regions.
        
        Returns:
            List of region names
        """
        return ivcf_dashboard_crud.get_curitiba_regions()
    
    @staticmethod
    def get_fragile_elderly_percentage(
        db: Session,
        period_from: Optional[date] = None,
        period_to: Optional[date] = None,
        region: Optional[str] = None,
        health_unit_id: Optional[int] = None,
        age_range: Optional[str] = None
    ) -> "FragileElderlyPercentageResponse":
        """
        Get percentage of fragile elderly with filters.
        
        Args:
            db: Database session
            period_from: Start date filter
            period_to: End date filter
            region: Region filter
            health_unit_id: Health unit filter
            age_range: Age range filter
            
        Returns:
            FragileElderlyPercentageResponse object
            
        Raises:
            HTTPException: If invalid filters provided
        """
        # Validate filters
        if region and not ivcf_dashboard_crud.validate_curitiba_region(region):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Região '{region}' não é uma região válida de Curitiba"
            )
        
        if age_range and not ivcf_dashboard_crud.validate_age_range(age_range):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Faixa etária '{age_range}' não é válida. Use: 60-70, 71-80, 81+"
            )
        
        # Get fragile elderly percentage data
        percentage_data = ivcf_dashboard_crud.get_fragile_elderly_percentage(
            db, period_from, period_to, region, health_unit_id, age_range
        )
        
        # Get applied filters
        filters_applied = ivcf_dashboard_crud.get_dashboard_filters_applied(
            period_from, period_to, region, health_unit_id, age_range
        )
        filters_applied["total_patients"] = percentage_data["total_elderly"]
        
        # Create response
        filters = FiltersApplied(**filters_applied)
        
        # Create percentage data structure
        from schemas.ivcf.ivcf_dashboard import FragilePercentageData, FragileElderlyPercentageResponse
        
        # Calculate breakdown (we need to get classification counts)
        breakdown = {
            "robust": 0,
            "risk": 0,
            "fragile": percentage_data["fragile_elderly"]
        }
        
        percentage_data_obj = FragilePercentageData(
            total_patients=percentage_data["total_elderly"],
            fragile_patients=percentage_data["fragile_elderly"],
            fragile_percentage=percentage_data["fragile_percentage"],
            breakdown=breakdown
        )
        
        return FragileElderlyPercentageResponse(
            percentage_data=percentage_data_obj,
            filters_applied=filters
        )
    
    @staticmethod
    def validate_filters(
        region: Optional[str] = None,
        age_range: Optional[str] = None,
        classification: Optional[str] = None
    ) -> Dict[str, str]:
        """
        Validate dashboard filters.
        
        Args:
            region: Region to validate
            age_range: Age range to validate
            classification: Classification to validate
            
        Returns:
            Dictionary with validation results
        """
        errors = {}
        
        if region and not ivcf_dashboard_crud.validate_curitiba_region(region):
            errors["region"] = f"Região '{region}' não é válida"
        
        if age_range and not ivcf_dashboard_crud.validate_age_range(age_range):
            errors["age_range"] = f"Faixa etária '{age_range}' não é válida"
        
        if classification and not ivcf_dashboard_crud.validate_classification(classification):
            errors["classification"] = f"Classificação '{classification}' não é válida"
        
        return errors
