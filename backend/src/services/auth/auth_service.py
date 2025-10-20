from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import timedelta
from typing import Optional

from models.user.user import User
from db.user import user_crud
from db.user.user_crud import get_user_by_cpf
from core.security import verify_password, create_access_token
from config import settings


class AuthService:
    """Service layer for authentication logic"""
    
    @staticmethod
    def authenticate_user(db: Session, cpf: str, password: str) -> Optional[User]:
        """
        Authenticate a user by CPF and password.
        
        Args:
            db: Database session
            cpf: User CPF
            password: Plain text password
            
        Returns:
            User object if authentication successful, None otherwise
        """
        # Clean CPF (remove non-numeric characters)
        cpf_clean = ''.join(filter(str.isdigit, cpf))
        
        user = get_user_by_cpf(db, cpf_clean)
        if not user:
            return None
        
        if not verify_password(password, user.hashed_password):
            return None
        
        return user
    
    @staticmethod
    def create_user_token(user: User) -> dict:
        """
        Create an access token for a user.
        
        Args:
            user: User object
            
        Returns:
            Dictionary with access_token
        """
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.cpf, "user_id": user.id, "profile_type": user.profile_type.value},
            expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
        }
    
    @staticmethod
    def login_user(db: Session, cpf: str, password: str) -> dict:
        """
        Login a user and return token with user info.
        
        Args:
            db: Database session
            cpf: User CPF
            password: User password
            
        Returns:
            Dictionary with token and user information
            
        Raises:
            HTTPException: If authentication fails
        """
        user = AuthService.authenticate_user(db, cpf, password)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="CPF ou senha incorretos",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        token_data = AuthService.create_user_token(user)
        
        return {
            **token_data,
            "user": user
        }
