from pydantic import BaseModel, Field
from typing import Optional


class PasswordRecoveryRequest(BaseModel):
    """Schema for password recovery request"""
    cpf: str = Field(..., description="User CPF (without formatting)")
    current_password: str = Field(..., description="Current password")
    new_password: str = Field(..., min_length=6, description="New password (minimum 6 characters)")


class PasswordRecoveryResponse(BaseModel):
    """Schema for password recovery response"""
    message: str = Field(..., description="Success message")
    success: bool = Field(default=True, description="Operation success status")
