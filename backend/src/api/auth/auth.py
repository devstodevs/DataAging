from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import timedelta
from jose import JWTError, jwt
from typing import Optional

from config import settings
from db.base import get_db
from db.user import user_crud
from models.user.user import User
from schemas.user import UserResponse
from services.auth import AuthService

router = APIRouter()

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_PREFIX}/login")


class Token(BaseModel):
    """Token response schema"""
    access_token: str
    user: UserResponse


class TokenData(BaseModel):
    """Token data schema"""
    cpf: Optional[str] = None


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Get the current authenticated user from JWT token.
    
    Args:
        token: JWT token from Authorization header
        db: Database session
        
    Returns:
        Current User object
        
    Raises:
        HTTPException: If token is invalid or user not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        cpf: str = payload.get("sub")
        if cpf is None:
            raise credentials_exception
        token_data = TokenData(cpf=cpf)
    except JWTError:
        raise credentials_exception
    
    user = get_user_by_cpf(db, cpf=token_data.cpf)
    if user is None:
        raise credentials_exception
    
    return user


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Login endpoint - authenticate user and return JWT token.
    
    **Request Body (form-data):**
    - username: User CPF (without formatting, e.g., "12345678901")
    - password: User password
    
    **Returns:**
    - access_token: JWT token for authentication
    - user: User information (without password)
    
    **Raises:**
    - 401: Incorrect CPF or password
    
    **Note:** Use CPF as username in the login form.
    
    **Example:**
    ```
    username: 12345678901
    password: senha123
    ```
    """
    # Use AuthService to authenticate and generate token
    return AuthService.login_user(db, form_data.username, form_data.password)


@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user information.
    
    **Headers:**
    - Authorization: Bearer {token}
    
    **Returns:**
    - Current user information
    
    **Raises:**
    - 401: Invalid or missing token
    """
    return current_user