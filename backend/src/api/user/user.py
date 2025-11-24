from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from typing import List, Union
from db.base import get_db
from schemas.user import (
    UserCreateGestor,
    UserCreateTecnico,
    UserUpdate,
    UserResponse
)
from services.user import UserService
from api.auth.auth import get_current_user
from models.user.user import User

router = APIRouter()


@router.post("/users/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user: Union[UserCreateGestor, UserCreateTecnico] = Body(..., discriminator='profile_type'),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new user (Gestor or Tecnico).
    
    **Request Body:**
    - For Gestor: Include `profile_type: "gestor"` and `matricula`
    - For Tecnico: Include `profile_type: "tecnico"` and optional `registro_profissional`, `especialidade`
    
    **Returns:**
    - Created user data (without password)
    
    **Raises:**
    - 409: CPF or matricula already exists
    - 422: Validation error
    """
    return UserService.create_new_user(db, user)


@router.get("/users/", response_model=List[UserResponse])
def list_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List all users with pagination.
    
    **Query Parameters:**
    - skip: Number of records to skip (default: 0)
    - limit: Maximum number of records to return (default: 100, max: 100)
    
    **Returns:**
    - List of users (without passwords)
    """
    if limit > 100:
        limit = 100
    return UserService.get_all_users(db, skip, limit)


@router.get("/users/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific user by ID.
    
    **Path Parameters:**
    - user_id: User ID
    
    **Returns:**
    - User data (without password)
    
    **Raises:**
    - 404: User not found
    """
    return UserService.get_user_by_id(db, user_id)


@router.put("/users/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update an existing user.
    
    **Path Parameters:**
    - user_id: User ID to update
    
    **Request Body:**
    - Any user fields to update (all optional)
    - If updating password, provide new password (will be hashed)
    
    **Returns:**
    - Updated user data (without password)
    
    **Raises:**
    - 404: User not found
    - 409: CPF or matricula already exists (if updating these fields)
    """
    return UserService.update_user(db, user_id, user_update)


@router.delete("/users/{user_id}", status_code=status.HTTP_200_OK)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a user.
    
    **Path Parameters:**
    - user_id: User ID to delete
    
    **Returns:**
    - Success message
    
    **Raises:**
    - 404: User not found
    """
    UserService.delete_user(db, user_id)
    return {"detail": "User deleted"}
