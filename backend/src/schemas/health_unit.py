from pydantic import BaseModel, Field, field_validator
from typing import Optional


class HealthUnitBase(BaseModel):
    """Base schema with common health unit fields"""
    nome: str = Field(..., min_length=3, max_length=200)
    bairro: str = Field(..., min_length=2, max_length=100)
    regiao: str = Field(..., min_length=2, max_length=50)
    ativo: bool = Field(default=True)


class HealthUnitCreate(HealthUnitBase):
    """Schema for creating a health unit"""
    pass


class HealthUnitUpdate(BaseModel):
    """Schema for updating a health unit - all fields optional"""
    nome: Optional[str] = Field(None, min_length=3, max_length=200)
    bairro: Optional[str] = Field(None, min_length=2, max_length=100)
    regiao: Optional[str] = Field(None, min_length=2, max_length=50)
    ativo: Optional[bool] = None


class HealthUnitResponse(HealthUnitBase):
    """Schema for health unit responses"""
    id: int
    
    class Config:
        from_attributes = True
