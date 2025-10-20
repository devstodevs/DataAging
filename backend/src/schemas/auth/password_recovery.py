from pydantic import BaseModel, Field
from typing import Optional


class PasswordRecoveryRequest(BaseModel):
    """Schema for password recovery request using a recovery password"""
    cpf: str = Field(..., description="User CPF (without formatting)")
    recovery_password: str = Field(..., description="Recovery password set during registration")
    new_password: str = Field(..., min_length=6, description="New password (minimum 6 characters)")


class PasswordRecoveryResponse(BaseModel):
    """Schema for password recovery response"""
    message: str = Field(..., description="Success message")
    success: bool = Field(default=True, description="Operation success status")
