from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import date
import re


class FACTFPatientBase(BaseModel):
    nome_completo: str = Field(..., min_length=2, max_length=200)
    cpf: str = Field(..., min_length=11, max_length=14)
    idade: int = Field(..., ge=18, le=120)
    telefone: Optional[str] = Field(None, max_length=20)
    email: Optional[str] = Field(None, max_length=100)
    bairro: str = Field(..., min_length=2, max_length=100)
    unidade_saude_id: int = Field(..., gt=0)
    diagnostico_principal: Optional[str] = Field(None, max_length=200)
    comorbidades: Optional[str] = None
    tratamento_atual: Optional[str] = None

    @validator('cpf')
    def validate_cpf(cls, v):
        # Remove caracteres não numéricos
        cpf_numbers = re.sub(r'\D', '', v)
        if len(cpf_numbers) != 11:
            raise ValueError('CPF deve ter 11 dígitos')
        return cpf_numbers

    @validator('email')
    def validate_email(cls, v):
        if v and '@' not in v:
            raise ValueError('Email deve ter formato válido')
        return v


class FACTFPatientCreate(FACTFPatientBase):
    data_cadastro: Optional[date] = None


class FACTFPatientUpdate(BaseModel):
    nome_completo: Optional[str] = Field(None, min_length=2, max_length=200)
    telefone: Optional[str] = Field(None, max_length=20)
    email: Optional[str] = Field(None, max_length=100)
    bairro: Optional[str] = Field(None, min_length=2, max_length=100)
    unidade_saude_id: Optional[int] = Field(None, gt=0)
    diagnostico_principal: Optional[str] = Field(None, max_length=200)
    comorbidades: Optional[str] = None
    tratamento_atual: Optional[str] = None
    ativo: Optional[bool] = None


class FACTFPatientResponse(FACTFPatientBase):
    id: int
    data_cadastro: date
    ativo: bool
    
    class Config:
        from_attributes = True


class FACTFPatientList(BaseModel):
    id: int
    nome_completo: str
    cpf: str
    idade: int
    bairro: str
    data_cadastro: date
    ativo: bool
    ultima_avaliacao: Optional[date] = None
    pontuacao_ultima_avaliacao: Optional[float] = None
    classificacao_fadiga: Optional[str] = None
    
    class Config:
        from_attributes = True