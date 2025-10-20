from sqlalchemy.orm import Session
from typing import Optional, List
from models.user import User
from schemas.user import UserCreateGestor, UserCreateTecnico, UserUpdate


def get_user(db: Session, user_id: int) -> Optional[User]:
    """
    Get a user by ID.
    
    Args:
        db: Database session
        user_id: User ID
        
    Returns:
        User object or None if not found
    """
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_cpf(db: Session, cpf: str) -> Optional[User]:
    """
    Get a user by CPF.
    
    Args:
        db: Database session
        cpf: User CPF
        
    Returns:
        User object or None if not found
    """
    return db.query(User).filter(User.cpf == cpf).first()


def get_user_by_matricula(db: Session, matricula: str) -> Optional[User]:
    """
    Get a user by matricula (for Gestor).
    
    Args:
        db: Database session
        matricula: User matricula
        
    Returns:
        User object or None if not found
    """
    return db.query(User).filter(User.matricula == matricula).first()


def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    """
    Get a list of users with pagination.
    
    Args:
        db: Database session
        skip: Number of records to skip
        limit: Maximum number of records to return
        
    Returns:
        List of User objects
    """
    return db.query(User).offset(skip).limit(limit).all()


def create_user(
    db: Session, 
    user_data: dict
) -> User:
    """
    Create a new user in the database.
    
    Args:
        db: Database session
        user_data: Dictionary with user data
        
    Returns:
        Created User object
    """
    db_user = User(**user_data)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(
    db: Session, 
    user_id: int, 
    user_update: UserUpdate
) -> Optional[User]:
    """
    Update an existing user.
    
    Args:
        db: Database session
        user_id: User ID to update
        user_update: UserUpdate schema with updated data
        
    Returns:
        Updated User object or None if not found
    """
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    
    # Update only provided fields
    update_data = user_update.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: int) -> bool:
    """
    Delete a user from the database.
    
    Args:
        db: Database session
        user_id: User ID to delete
        
    Returns:
        True if deleted, False if not found
    """
    db_user = get_user(db, user_id)
    if not db_user:
        return False
    
    db.delete(db_user)
    db.commit()
    return True
