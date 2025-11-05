from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any
from datetime import date


class PhysicalActivityEvaluationBase(BaseModel):
    """Base schema for Physical Activity Evaluation"""
    data_avaliacao: date = Field(..., description="Data da avaliação")
    
    # Physical Activity by Intensity
    light_activity_minutes_per_day: int = Field(0, ge=0, le=480, description="Minutos de atividade leve por dia (0-480)")
    light_activity_days_per_week: int = Field(0, ge=0, le=7, description="Dias de atividade leve por semana (0-7)")
    moderate_activity_minutes_per_day: int = Field(0, ge=0, le=300, description="Minutos de atividade moderada por dia (0-300)")
    moderate_activity_days_per_week: int = Field(0, ge=0, le=7, description="Dias de atividade moderada por semana (0-7)")
    vigorous_activity_minutes_per_day: int = Field(0, ge=0, le=180, description="Minutos de atividade vigorosa por dia (0-180)")
    vigorous_activity_days_per_week: int = Field(0, ge=0, le=7, description="Dias de atividade vigorosa por semana (0-7)")
    
    # Sedentary behavior
    sedentary_hours_per_day: float = Field(..., ge=0, le=24, description="Horas sedentárias por dia (0-24)")
    screen_time_hours_per_day: float = Field(0, ge=0, le=24, description="Tempo de tela por dia (0-24)")
    
    # Optional fields
    respostas_detalhadas: Optional[Dict[str, Any]] = Field(None, description="Respostas detalhadas do questionário")
    observacoes: Optional[str] = Field(None, description="Observações adicionais")
    profissional_responsavel: Optional[str] = Field(None, max_length=255, description="Profissional responsável")

    @validator('data_avaliacao')
    def validate_evaluation_date(cls, v):
        if v > date.today():
            raise ValueError('Data da avaliação não pode ser futura')
        return v

    @validator('sedentary_hours_per_day', 'screen_time_hours_per_day')
    def validate_hours_consistency(cls, v, values):
        # Basic validation - more complex validation will be done in service layer
        if v < 0 or v > 24:
            raise ValueError('Horas devem estar entre 0 e 24')
        return v


class PhysicalActivityEvaluationCreate(PhysicalActivityEvaluationBase):
    """Schema for creating a Physical Activity Evaluation"""
    # Allow optional calculated fields to be provided
    total_weekly_moderate_minutes: Optional[int] = Field(None, ge=0, description="Total de minutos semanais de atividade moderada")
    total_weekly_vigorous_minutes: Optional[int] = Field(None, ge=0, description="Total de minutos semanais de atividade vigorosa")
    who_compliance: Optional[bool] = Field(None, description="Conformidade com diretrizes da OMS")
    sedentary_risk_level: Optional[str] = Field(None, description="Nível de risco sedentário")


class PhysicalActivityEvaluationUpdate(BaseModel):
    """Schema for updating a Physical Activity Evaluation"""
    data_avaliacao: Optional[date] = None
    light_activity_minutes_per_day: Optional[int] = Field(None, ge=0, le=480)
    light_activity_days_per_week: Optional[int] = Field(None, ge=0, le=7)
    moderate_activity_minutes_per_day: Optional[int] = Field(None, ge=0, le=300)
    moderate_activity_days_per_week: Optional[int] = Field(None, ge=0, le=7)
    vigorous_activity_minutes_per_day: Optional[int] = Field(None, ge=0, le=180)
    vigorous_activity_days_per_week: Optional[int] = Field(None, ge=0, le=7)
    sedentary_hours_per_day: Optional[float] = Field(None, ge=0, le=24)
    screen_time_hours_per_day: Optional[float] = Field(None, ge=0, le=24)
    respostas_detalhadas: Optional[Dict[str, Any]] = None
    observacoes: Optional[str] = None
    profissional_responsavel: Optional[str] = Field(None, max_length=255)

    @validator('data_avaliacao')
    def validate_evaluation_date(cls, v):
        if v and v > date.today():
            raise ValueError('Data da avaliação não pode ser futura')
        return v


class PhysicalActivityEvaluationResponse(PhysicalActivityEvaluationBase):
    """Schema for Physical Activity Evaluation response"""
    id: int
    patient_id: int
    
    # Calculated fields
    total_weekly_moderate_minutes: int
    total_weekly_vigorous_minutes: int
    who_compliance: bool
    sedentary_risk_level: str

    class Config:
        from_attributes = True