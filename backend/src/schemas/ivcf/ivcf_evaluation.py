from pydantic import BaseModel, Field, model_validator
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
    


class IVCFEvaluationCreateSimple(BaseModel):
    """Schema for creating an IVCF evaluation with automatic score calculation"""
    patient_id: int = Field(..., gt=0)
    data_avaliacao: date = Field(..., le=date.today())  # Cannot be future date
    
    # Individual domain scores (0-5 each) - only these are required
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
    
    def to_ivcf_evaluation_create(self) -> 'IVCFEvaluationCreate':
        """Convert to IVCFEvaluationCreate with calculated fields"""
        # Calculate total from domain scores
        domain_scores = [
            self.dominio_idade,
            self.dominio_comorbidades,
            self.dominio_comunicacao,
            self.dominio_mobilidade,
            self.dominio_humor,
            self.dominio_cognicao,
            self.dominio_avd,
            self.dominio_autopercepcao,
        ]
        total_score = sum(domain_scores)
        
        # Determine classification based on total score
        if total_score <= 12:
            classification = "Robusto"
        elif 13 <= total_score <= 19:
            classification = "Em Risco"
        else:  # total_score >= 20
            classification = "Frágil"
        
        # Create IVCFEvaluationCreate with calculated fields
        return IVCFEvaluationCreate(
            patient_id=self.patient_id,
            data_avaliacao=self.data_avaliacao,
            pontuacao_total=total_score,
            classificacao=classification,
            dominio_idade=self.dominio_idade,
            dominio_comorbidades=self.dominio_comorbidades,
            dominio_comunicacao=self.dominio_comunicacao,
            dominio_mobilidade=self.dominio_mobilidade,
            dominio_humor=self.dominio_humor,
            dominio_cognicao=self.dominio_cognicao,
            dominio_avd=self.dominio_avd,
            dominio_autopercepcao=self.dominio_autopercepcao,
            comorbidades=self.comorbidades,
            observacoes=self.observacoes
        )


class IVCFEvaluationCreate(IVCFEvaluationBase):
    """Schema for creating an IVCF evaluation with manual score and classification"""
    
    @model_validator(mode='after')
    def validate_scores_and_classification(self):
        """Validate that total score matches sum of domain scores and classification is correct"""
        # Calculate expected total from domain scores
        domain_scores = [
            self.dominio_idade,
            self.dominio_comorbidades,
            self.dominio_comunicacao,
            self.dominio_mobilidade,
            self.dominio_humor,
            self.dominio_cognicao,
            self.dominio_avd,
            self.dominio_autopercepcao,
        ]
        expected_total = sum(domain_scores)
        
        # Validate total score matches sum of domains
        if self.pontuacao_total != expected_total:
            raise ValueError(f"Pontuação total ({self.pontuacao_total}) deve ser igual à soma dos domínios ({expected_total})")
        
        # Validate classification based on total score
        total_score = self.pontuacao_total
        if total_score <= 12 and self.classificacao != "Robusto":
            raise ValueError("Pontuação 0-12 deve ser classificada como 'Robusto'")
        elif 13 <= total_score <= 19 and self.classificacao != "Em Risco":
            raise ValueError("Pontuação 13-19 deve ser classificada como 'Em Risco'")
        elif total_score >= 20 and self.classificacao != "Frágil":
            raise ValueError("Pontuação 20-40 deve ser classificada como 'Frágil'")
        
        return self


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
