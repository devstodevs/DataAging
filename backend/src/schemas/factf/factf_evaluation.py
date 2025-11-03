from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any
from datetime import date


class FACTFEvaluationBase(BaseModel):
    data_avaliacao: date
    bem_estar_fisico: float = Field(..., ge=0, le=28)
    bem_estar_social: float = Field(..., ge=0, le=28)
    bem_estar_emocional: float = Field(..., ge=0, le=24)
    bem_estar_funcional: float = Field(..., ge=0, le=28)
    subescala_fadiga: float = Field(..., ge=0, le=52)
    respostas_detalhadas: Optional[str] = None
    observacoes: Optional[str] = None
    profissional_responsavel: Optional[str] = Field(None, max_length=200)


class FACTFEvaluationCreate(FACTFEvaluationBase):
    patient_id: int = Field(..., gt=0)


class FACTFEvaluationUpdate(BaseModel):
    data_avaliacao: Optional[date] = None
    bem_estar_fisico: Optional[float] = Field(None, ge=0, le=28)
    bem_estar_social: Optional[float] = Field(None, ge=0, le=28)
    bem_estar_emocional: Optional[float] = Field(None, ge=0, le=24)
    bem_estar_funcional: Optional[float] = Field(None, ge=0, le=28)
    subescala_fadiga: Optional[float] = Field(None, ge=0, le=52)
    respostas_detalhadas: Optional[str] = None
    observacoes: Optional[str] = None
    profissional_responsavel: Optional[str] = Field(None, max_length=200)


class FACTFEvaluationResponse(FACTFEvaluationBase):
    id: int
    patient_id: int
    pontuacao_total: float
    pontuacao_fadiga: float
    classificacao_fadiga: str
    
    class Config:
        from_attributes = True


class FACTFEvaluationList(BaseModel):
    id: int
    patient_id: int
    data_avaliacao: date
    pontuacao_total: float
    pontuacao_fadiga: float
    classificacao_fadiga: str
    profissional_responsavel: Optional[str] = None
    
    class Config:
        from_attributes = True