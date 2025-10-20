from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import date


class IVCFPatientBase(BaseModel):
    """Base schema with common IVCF patient fields"""
    nome_completo: str = Field(..., min_length=3, max_length=200)
    cpf: str = Field(..., min_length=11, max_length=14)
    idade: int = Field(..., ge=60, le=120)  # Minimum age 60
    telefone: Optional[str] = Field(None, max_length=20)
    bairro: str = Field(..., min_length=2, max_length=100)
    unidade_saude_id: int = Field(..., gt=0)
    
    @field_validator('cpf')
    @classmethod
    def validate_cpf(cls, v: str) -> str:
        """Remove non-numeric characters from CPF"""
        return ''.join(filter(str.isdigit, v))


class IVCFPatientCreate(IVCFPatientBase):
    """Schema for creating an IVCF patient"""
    data_cadastro: date = Field(default_factory=date.today)


class IVCFPatientUpdate(BaseModel):
    """Schema for updating an IVCF patient - all fields optional"""
    nome_completo: Optional[str] = Field(None, min_length=3, max_length=200)
    cpf: Optional[str] = Field(None, min_length=11, max_length=14)
    idade: Optional[int] = Field(None, ge=60, le=120)
    telefone: Optional[str] = Field(None, max_length=20)
    bairro: Optional[str] = Field(None, min_length=2, max_length=100)
    unidade_saude_id: Optional[int] = Field(None, gt=0)
    ativo: Optional[bool] = None
    
    @field_validator('cpf')
    @classmethod
    def validate_cpf(cls, v: Optional[str]) -> Optional[str]:
        """Remove non-numeric characters from CPF"""
        return ''.join(filter(str.isdigit, v)) if v else None


class IVCFPatientResponse(IVCFPatientBase):
    """Schema for IVCF patient responses"""
    id: int
    data_cadastro: date
    ativo: bool
    
    class Config:
        from_attributes = True


class IVCFPatientWithEvaluations(IVCFPatientResponse):
    """Schema for IVCF patient with evaluations"""
    evaluations: List[dict] = Field(default_factory=list)
    
    class Config:
        from_attributes = True
