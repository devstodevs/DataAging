from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Union, List
from schemas.user import UserCreateGestor, UserCreateTecnico, UserUpdate, UserResponse
from db.user import user_crud
from core.security import get_password_hash
from models.user.user import User, ProfileType


class UserService:
    """Service layer for user business logic"""
    
    @staticmethod
    def create_new_user(
        db: Session,
        user_create: Union[UserCreateGestor, UserCreateTecnico]
    ) -> User:
        """
        Create a new user with validation.
        
        Args:
            db: Database session
            user_create: User creation schema (Gestor or Tecnico)
            
        Returns:
            Created User object
            
        Raises:
            HTTPException: If CPF or matricula already exists
        """
        # Check if CPF already exists
        existing_user = user_crud.get_user_by_cpf(db, user_create.cpf)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="CPF já cadastrado"
            )
        
        # Check if matricula already exists (for Gestor)
        if isinstance(user_create, UserCreateGestor):
            existing_matricula = user_crud.get_user_by_matricula(db, user_create.matricula)
            if existing_matricula:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Matrícula já cadastrada"
                )
        
        # Hash the password
        hashed_password = get_password_hash(user_create.password)
        
        # Prepare user data
        user_data = user_create.model_dump(exclude={'password'})
        user_data['hashed_password'] = hashed_password
        
        # Create user in database
        return user_crud.create_user(db, user_data)
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> User:
        """
        Get a user by ID.
        
        Args:
            db: Database session
            user_id: User ID
            
        Returns:
            User object
            
        Raises:
            HTTPException: If user not found
        """
        user = user_crud.get_user(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado"
            )
        return user
    
    @staticmethod
    def get_all_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
        """
        Get all users with pagination.
        
        Args:
            db: Database session
            skip: Number of records to skip
            limit: Maximum number of records to return
            
        Returns:
            List of User objects
        """
        return user_crud.get_users(db, skip, limit)
    
    @staticmethod
    def update_user(
        db: Session,
        user_id: int,
        user_update: UserUpdate
    ) -> User:
        """
        Update a user.
        
        Args:
            db: Database session
            user_id: User ID to update
            user_update: UserUpdate schema with updated data
            
        Returns:
            Updated User object
            
        Raises:
            HTTPException: If user not found or validation fails
        """
        # Check if user exists
        existing_user = user_crud.get_user(db, user_id)
        if not existing_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado"
            )
        
        # If CPF is being updated, check for duplicates
        if user_update.cpf and user_update.cpf != existing_user.cpf:
            cpf_exists = user_crud.get_user_by_cpf(db, user_update.cpf)
            if cpf_exists:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="CPF já cadastrado"
                )
        
        # If matricula is being updated, check for duplicates
        if user_update.matricula and user_update.matricula != existing_user.matricula:
            matricula_exists = user_crud.get_user_by_matricula(db, user_update.matricula)
            if matricula_exists:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Matrícula já cadastrada"
                )
        
        # If password is being updated, hash it
        update_data = user_update.model_dump(exclude_unset=True)
        if 'password' in update_data:
            update_data['hashed_password'] = get_password_hash(update_data.pop('password'))
        
        # Create a new UserUpdate with the modified data
        modified_update = UserUpdate(**update_data)
        
        # Update user
        updated_user = user_crud.update_user(db, user_id, modified_update)
        if not updated_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado"
            )
        
        return updated_user
    
    @staticmethod
    def delete_user(db: Session, user_id: int) -> bool:
        """
        Delete a user.
        
        Args:
            db: Database session
            user_id: User ID to delete
            
        Returns:
            True if deleted
            
        Raises:
            HTTPException: If user not found
        """
        deleted = user_crud.delete_user(db, user_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado"
            )
        return True
