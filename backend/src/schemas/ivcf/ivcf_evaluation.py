from pydantic import BaseModel, Field, field_validator
from typing import Optional, Literal
from datetime import date


class IVCFEvaluationBase(BaseModel):
    """Base schema with common IVCF evaluation fields"""
    patient_id: int = Field(..., gt=0)
    data_avaliacao: date = Field(..., le=date.today())  # Cannot be future date
    pontuacao_total: int = Field(..., ge=0, le=40)
    classificacao: Literal["Robusto", "Em Risco", "Frágil"]
    
    # Individual domain scores (0-5 each)
    dominio_idade: int = Field(..., ge=0, le=5)
    dominio_comorbidades: int = Field(..., ge=0, le=5)
    dominio_comunicacao: int = Field(..., ge=0, le=5)
    dominio_mobilidade: int = Field(..., ge=0, le=5)
    dominio_humor: int = Field(..., ge=0, le=5)
    dominio_cognicao: int = Field(..., ge=0, le=5)
    dominio_avd: int = Field(..., ge=0, le=5)
    dominio_autopercepcao: int = Field(..., ge=0, le=5)
    
    # Additional information
    comorbidades: Optional[str] = Field(None, max_length=500)
    observacoes: Optional[str] = Field(None, max_length=1000)
    
    @field_validator('pontuacao_total')
    @classmethod
    def validate_total_score(cls, v: int, info) -> int:
        """Validate that total score matches sum of domain scores"""
        if 'data' in info and info['data']:
            domain_scores = [
                info['data'].get('dominio_idade', 0),
                info['data'].get('dominio_comorbidades', 0),
                info['data'].get('dominio_comunicacao', 0),
                info['data'].get('dominio_mobilidade', 0),
                info['data'].get('dominio_humor', 0),
                info['data'].get('dominio_cognicao', 0),
                info['data'].get('dominio_avd', 0),
                info['data'].get('dominio_autopercepcao', 0),
            ]
            expected_total = sum(domain_scores)
            if v != expected_total:
                raise ValueError(f"Pontuação total ({v}) deve ser igual à soma dos domínios ({expected_total})")
        return v
    
    @field_validator('classificacao')
    @classmethod
    def validate_classification(cls, v: str, info) -> str:
        """Validate classification based on total score"""
        if 'data' in info and info['data']:
            total_score = info['data'].get('pontuacao_total', 0)
            if total_score <= 12 and v != "Robusto":
                raise ValueError("Pontuação 0-12 deve ser classificada como 'Robusto'")
            elif 13 <= total_score <= 19 and v != "Em Risco":
                raise ValueError("Pontuação 13-19 deve ser classificada como 'Em Risco'")
            elif total_score >= 20 and v != "Frágil":
                raise ValueError("Pontuação 20-40 deve ser classificada como 'Frágil'")
        return v


class IVCFEvaluationCreate(IVCFEvaluationBase):
    """Schema for creating an IVCF evaluation"""
    pass


class IVCFEvaluationUpdate(BaseModel):
    """Schema for updating an IVCF evaluation - all fields optional"""
    data_avaliacao: Optional[date] = Field(None, le=date.today())
    pontuacao_total: Optional[int] = Field(None, ge=0, le=40)
    classificacao: Optional[Literal["Robusto", "Em Risco", "Frágil"]] = None
    
    # Individual domain scores
    dominio_idade: Optional[int] = Field(None, ge=0, le=5)
    dominio_comorbidades: Optional[int] = Field(None, ge=0, le=5)
    dominio_comunicacao: Optional[int] = Field(None, ge=0, le=5)
    dominio_mobilidade: Optional[int] = Field(None, ge=0, le=5)
    dominio_humor: Optional[int] = Field(None, ge=0, le=5)
    dominio_cognicao: Optional[int] = Field(None, ge=0, le=5)
    dominio_avd: Optional[int] = Field(None, ge=0, le=5)
    dominio_autopercepcao: Optional[int] = Field(None, ge=0, le=5)
    
    # Additional information
    comorbidades: Optional[str] = Field(None, max_length=500)
    observacoes: Optional[str] = Field(None, max_length=1000)


class IVCFEvaluationResponse(IVCFEvaluationBase):
    """Schema for IVCF evaluation responses"""
    id: int
    
    class Config:
        from_attributes = True


class IVCFEvaluationWithPatient(IVCFEvaluationResponse):
    """Schema for IVCF evaluation with patient data"""
    patient: dict = Field(default_factory=dict)
    
    class Config:
        from_attributes = True
