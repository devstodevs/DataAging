from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import date
import re


class PhysicalActivityPatientBase(BaseModel):
    """Base schema for Physical Activity Patient"""
    nome_completo: str = Field(..., min_length=2, max_length=255, description="Nome completo do paciente")
    cpf: str = Field(..., min_length=11, max_length=11, description="CPF do paciente (apenas números)")
    idade: int = Field(..., ge=60, le=120, description="Idade do paciente (mínimo 60 anos)")
    telefone: Optional[str] = Field(None, max_length=20, description="Telefone do paciente")
    email: Optional[str] = Field(None, max_length=255, description="Email do paciente")
    bairro: str = Field(..., min_length=2, max_length=100, description="Bairro do paciente")
    unidade_saude_id: int = Field(..., gt=0, description="ID da unidade de saúde")
    diagnostico_principal: Optional[str] = Field(None, max_length=255, description="Diagnóstico principal")
    comorbidades: Optional[str] = Field(None, description="Comorbidades do paciente")
    medicamentos_atuais: Optional[str] = Field(None, description="Medicamentos atuais")

    @validator('cpf')
    def validate_cpf(cls, v):
        if not re.match(r'^\d{11}$', v):
            raise ValueError('CPF deve conter exatamente 11 dígitos numéricos')
        return v

    @validator('email')
    def validate_email(cls, v):
        if v and not re.match(r'^[^@]+@[^@]+\.[^@]+$', v):
            raise ValueError('Email deve ter formato válido')
        return v


class PhysicalActivityPatientCreate(PhysicalActivityPatientBase):
    """Schema for creating a Physical Activity Patient"""
    pass


class PhysicalActivityPatientUpdate(BaseModel):
    """Schema for updating a Physical Activity Patient"""
    nome_completo: Optional[str] = Field(None, min_length=2, max_length=255)
    telefone: Optional[str] = Field(None, max_length=20)
    email: Optional[str] = Field(None, max_length=255)
    bairro: Optional[str] = Field(None, min_length=2, max_length=100)
    unidade_saude_id: Optional[int] = Field(None, gt=0)
    diagnostico_principal: Optional[str] = Field(None, max_length=255)
    comorbidades: Optional[str] = None
    medicamentos_atuais: Optional[str] = None
    ativo: Optional[bool] = None

    @validator('email')
    def validate_email(cls, v):
        if v and not re.match(r'^[^@]+@[^@]+\.[^@]+$', v):
            raise ValueError('Email deve ter formato válido')
        return v


class PhysicalActivityPatientResponse(PhysicalActivityPatientBase):
    """Schema for Physical Activity Patient response"""
    id: int
    data_cadastro: date
    ativo: bool

    class Config:
        from_attributes = True


class PhysicalActivityPatientList(BaseModel):
    """Schema for paginated Physical Activity Patient list"""
    patients: List[PhysicalActivityPatientResponse]
    total: int
    page: int
    per_page: int
    total_pages: int