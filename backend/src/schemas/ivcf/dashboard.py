from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import date


class DomainDistribution(BaseModel):
    """Schema for domain distribution data"""
    domain: str
    average_score: float = Field(..., ge=0, le=5)
    min_score: int = Field(..., ge=0, le=5)
    max_score: int = Field(..., ge=0, le=5)
    patient_count: int = Field(..., gt=0)


class ChartConfig(BaseModel):
    """Schema for chart configuration"""
    min_value: float = Field(default=2.0)
    max_value: float = Field(default=8.0)
    scale_marks: List[float] = Field(default=[2, 3, 4, 5, 6, 7, 8])


class FiltersApplied(BaseModel):
    """Schema for applied filters information"""
    period: Optional[str] = None
    region: Optional[str] = None
    health_unit_id: Optional[int] = None
    age_range: Optional[str] = None
    classification: Optional[str] = None
    total_patients: int = Field(..., gt=0)


class DomainDistributionResponse(BaseModel):
    """Schema for domain distribution API response"""
    data: List[DomainDistribution]
    chart_config: ChartConfig
    filters_applied: FiltersApplied


class IVCFSummary(BaseModel):
    """Schema for IVCF summary data"""
    total_elderly: int = Field(..., gt=0)
    fragile_percentage: float = Field(..., ge=0, le=100)
    risk_percentage: float = Field(..., ge=0, le=100)
    robust_percentage: float = Field(..., ge=0, le=100)
    average_score: float = Field(..., ge=0, le=40)
    critical_patients: int = Field(..., ge=0)


class RegionAverage(BaseModel):
    """Schema for region average data"""
    region: str
    bairro: str
    average_score: float = Field(..., ge=0, le=40)
    patient_count: int = Field(..., gt=0)
    fragile_count: int = Field(..., ge=0)
    risk_count: int = Field(..., ge=0)
    robust_count: int = Field(..., ge=0)


class RegionAverageResponse(BaseModel):
    """Schema for region average API response"""
    data: List[RegionAverage]
    filters_applied: FiltersApplied


class MonthlyEvolution(BaseModel):
    """Schema for monthly evolution data"""
    month: str
    year: int
    robust: int = Field(..., ge=0)
    risk: int = Field(..., ge=0)
    fragile: int = Field(..., ge=0)
    total: int = Field(..., gt=0)


class MonthlyEvolutionResponse(BaseModel):
    """Schema for monthly evolution API response"""
    data: List[MonthlyEvolution]
    filters_applied: FiltersApplied


class CriticalPatient(BaseModel):
    """Schema for critical patient data"""
    patient_id: int
    nome_completo: str
    idade: int
    pontuacao_total: int
    classificacao: str
    comorbidades: Optional[str]
    data_ultima_avaliacao: date
    bairro: str
    unidade_saude: str


class CriticalPatientsResponse(BaseModel):
    """Schema for critical patients API response"""
    data: List[CriticalPatient]
    total_critical: int = Field(..., ge=0)
