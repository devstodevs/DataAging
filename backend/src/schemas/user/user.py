from pydantic import BaseModel, Field, field_validator
from typing import Optional, Literal
from datetime import date
from models.user.user import ProfileType


class UserBase(BaseModel):
    """Base schema with common user fields"""
    nome_completo: str = Field(..., min_length=3, max_length=200)
    cpf: str = Field(..., min_length=11, max_length=14)
    telefone: Optional[str] = Field(None, max_length=20)
    sexo: Optional[str] = Field(None, max_length=20)
    data_nascimento: Optional[date] = None
    
    # Address fields
    cep: Optional[str] = Field(None, max_length=10)
    logradouro: Optional[str] = Field(None, max_length=200)
    numero: Optional[str] = Field(None, max_length=20)
    complemento: Optional[str] = Field(None, max_length=100)
    bairro: Optional[str] = Field(None, max_length=100)
    municipio: Optional[str] = Field(None, max_length=100)
    uf: Optional[str] = Field(None, max_length=2)
    
    @field_validator('cpf')
    @classmethod
    def validate_cpf(cls, v: str) -> str:
        """Remove non-numeric characters from CPF"""
        return ''.join(filter(str.isdigit, v))
    
    @field_validator('uf')
    @classmethod
    def validate_uf(cls, v: Optional[str]) -> Optional[str]:
        """Convert UF to uppercase"""
        return v.upper() if v else None


class GestorData(BaseModel):
    """Specific data for Gestor profile"""
    matricula: str = Field(..., min_length=1, max_length=50)


class TecnicoData(BaseModel):
    """Specific data for Tecnico profile"""
    registro_profissional: Optional[str] = Field(None, max_length=50)
    especialidade: Optional[str] = Field(None, max_length=100)
    unidade_lotacao_id: Optional[int] = None


class UserCreateGestor(UserBase):
    """Schema for creating a Gestor user"""
    password: str = Field(..., min_length=6, max_length=100)
    matricula: str = Field(..., min_length=1, max_length=50)
    profile_type: Literal["gestor"] = "gestor"


class UserCreateTecnico(UserBase):
    """Schema for creating a Tecnico user"""
    password: str = Field(..., min_length=6, max_length=100)
    registro_profissional: Optional[str] = Field(None, max_length=50)
    especialidade: Optional[str] = Field(None, max_length=100)
    unidade_lotacao_id: Optional[int] = None
    profile_type: Literal["tecnico"] = "tecnico"


class UserUpdate(BaseModel):
    """Schema for updating a user - all fields optional"""
    nome_completo: Optional[str] = Field(None, min_length=3, max_length=200)
    cpf: Optional[str] = Field(None, min_length=11, max_length=14)
    telefone: Optional[str] = Field(None, max_length=20)
    sexo: Optional[str] = Field(None, max_length=20)
    data_nascimento: Optional[date] = None
    
    # Address fields
    cep: Optional[str] = Field(None, max_length=10)
    logradouro: Optional[str] = Field(None, max_length=200)
    numero: Optional[str] = Field(None, max_length=20)
    complemento: Optional[str] = Field(None, max_length=100)
    bairro: Optional[str] = Field(None, max_length=100)
    municipio: Optional[str] = Field(None, max_length=100)
    uf: Optional[str] = Field(None, max_length=2)
    
    # Profile specific fields
    matricula: Optional[str] = Field(None, max_length=50)
    registro_profissional: Optional[str] = Field(None, max_length=50)
    especialidade: Optional[str] = Field(None, max_length=100)
    unidade_lotacao_id: Optional[int] = None
    
    # Password update
    password: Optional[str] = Field(None, min_length=6, max_length=100)
    
    @field_validator('cpf')
    @classmethod
    def validate_cpf(cls, v: Optional[str]) -> Optional[str]:
        """Remove non-numeric characters from CPF"""
        return ''.join(filter(str.isdigit, v)) if v else None
    
    @field_validator('uf')
    @classmethod
    def validate_uf(cls, v: Optional[str]) -> Optional[str]:
        """Convert UF to uppercase"""
        return v.upper() if v else None


class UserResponse(UserBase):
    """Schema for user responses - excludes password"""
    id: int
    profile_type: ProfileType
    
    # Profile specific fields
    matricula: Optional[str] = None
    registro_profissional: Optional[str] = None
    especialidade: Optional[str] = None
    unidade_lotacao_id: Optional[int] = None
    
    class Config:
        from_attributes = True
