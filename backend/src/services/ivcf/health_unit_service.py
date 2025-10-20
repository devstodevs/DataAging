from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional
from schemas.ivcf.health_unit import HealthUnitCreate, HealthUnitUpdate, HealthUnitResponse
from db.ivcf import health_unit_crud
from models.ivcf.health_unit import HealthUnit


class HealthUnitService:
    """Service layer for health unit business logic"""
    
    @staticmethod
    def create_health_unit(db: Session, health_unit_create: HealthUnitCreate) -> HealthUnit:
        """
        Create a new health unit with validation.
        
        Args:
            db: Database session
            health_unit_create: Health unit creation schema
            
        Returns:
            Created HealthUnit object
            
        Raises:
            HTTPException: If health unit name already exists
        """
        # Check if health unit name already exists
        existing_unit = health_unit_crud.get_health_unit_by_name(db, health_unit_create.nome)
        if existing_unit:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Nome da unidade de saúde já cadastrado"
            )
        
        # Create health unit
        health_unit_data = health_unit_create.model_dump()
        return health_unit_crud.create_health_unit(db, health_unit_data)
    
    @staticmethod
    def get_health_unit_by_id(db: Session, health_unit_id: int) -> HealthUnit:
        """
        Get a health unit by ID.
        
        Args:
            db: Database session
            health_unit_id: Health unit ID
            
        Returns:
            HealthUnit object
            
        Raises:
            HTTPException: If health unit not found
        """
        health_unit = health_unit_crud.get_health_unit(db, health_unit_id)
        if not health_unit:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Unidade de saúde não encontrada"
            )
        return health_unit
    
    @staticmethod
    def get_all_health_units(
        db: Session, 
        skip: int = 0, 
        limit: int = 100, 
        active_only: bool = True
    ) -> List[HealthUnit]:
        """
        Get all health units with pagination.
        
        Args:
            db: Database session
            skip: Number of records to skip
            limit: Maximum number of records to return
            active_only: Filter only active units
            
        Returns:
            List of HealthUnit objects
        """
        return health_unit_crud.get_health_units(db, skip, limit, active_only)
    
    @staticmethod
    def get_health_units_by_region(db: Session, regiao: str) -> List[HealthUnit]:
        """
        Get health units by region.
        
        Args:
            db: Database session
            regiao: Region name
            
        Returns:
            List of HealthUnit objects
        """
        return health_unit_crud.get_health_units_by_region(db, regiao)
    
    @staticmethod
    def update_health_unit(
        db: Session,
        health_unit_id: int,
        health_unit_update: HealthUnitUpdate
    ) -> HealthUnit:
        """
        Update a health unit.
        
        Args:
            db: Database session
            health_unit_id: Health unit ID to update
            health_unit_update: HealthUnitUpdate schema with updated data
            
        Returns:
            Updated HealthUnit object
            
        Raises:
            HTTPException: If health unit not found or validation fails
        """
        # Check if health unit exists
        existing_unit = health_unit_crud.get_health_unit(db, health_unit_id)
        if not existing_unit:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Unidade de saúde não encontrada"
            )
        
        # If name is being updated, check for duplicates
        if health_unit_update.nome and health_unit_update.nome != existing_unit.nome:
            name_exists = health_unit_crud.get_health_unit_by_name(db, health_unit_update.nome)
            if name_exists:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Nome da unidade de saúde já cadastrado"
                )
        
        # Update health unit
        update_data = health_unit_update.model_dump(exclude_unset=True)
        updated_unit = health_unit_crud.update_health_unit(db, health_unit_id, update_data)
        
        if not updated_unit:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Unidade de saúde não encontrada"
            )
        
        return updated_unit
    
    @staticmethod
    def delete_health_unit(db: Session, health_unit_id: int) -> bool:
        """
        Delete a health unit (soft delete).
        
        Args:
            db: Database session
            health_unit_id: Health unit ID to delete
            
        Returns:
            True if deleted
            
        Raises:
            HTTPException: If health unit not found
        """
        deleted = health_unit_crud.delete_health_unit(db, health_unit_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Unidade de saúde não encontrada"
            )
        return True
