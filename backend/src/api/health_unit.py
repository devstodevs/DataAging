from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from db.base import get_db
from schemas.health_unit import (
    HealthUnitCreate,
    HealthUnitUpdate,
    HealthUnitResponse
)
from services.health_unit_service import HealthUnitService

router = APIRouter()


@router.post("/health-units/", response_model=HealthUnitResponse, status_code=status.HTTP_201_CREATED)
def create_health_unit(
    health_unit: HealthUnitCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new health unit.
    
    **Request Body:**
    - nome: Health unit name
    - bairro: Neighborhood
    - regiao: Region
    - ativo: Active status (default: True)
    
    **Returns:**
    - Created health unit data
    
    **Raises:**
    - 409: Health unit name already exists
    - 422: Validation error
    """
    return HealthUnitService.create_health_unit(db, health_unit)


@router.get("/health-units/", response_model=List[HealthUnitResponse])
def list_health_units(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=100, description="Maximum number of records to return"),
    active_only: bool = Query(True, description="Filter only active units"),
    db: Session = Depends(get_db)
):
    """
    List all health units with pagination.
    
    **Query Parameters:**
    - skip: Number of records to skip (default: 0)
    - limit: Maximum number of records to return (default: 100, max: 100)
    - active_only: Filter only active units (default: True)
    
    **Returns:**
    - List of health units
    """
    return HealthUnitService.get_all_health_units(db, skip, limit, active_only)


@router.get("/health-units/{health_unit_id}", response_model=HealthUnitResponse)
def get_health_unit(
    health_unit_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific health unit by ID.
    
    **Path Parameters:**
    - health_unit_id: Health unit ID
    
    **Returns:**
    - Health unit data
    
    **Raises:**
    - 404: Health unit not found
    """
    return HealthUnitService.get_health_unit_by_id(db, health_unit_id)


@router.get("/health-units/region/{regiao}", response_model=List[HealthUnitResponse])
def get_health_units_by_region(
    regiao: str,
    db: Session = Depends(get_db)
):
    """
    Get health units by region.
    
    **Path Parameters:**
    - regiao: Region name
    
    **Returns:**
    - List of health units in the region
    """
    return HealthUnitService.get_health_units_by_region(db, regiao)


@router.put("/health-units/{health_unit_id}", response_model=HealthUnitResponse)
def update_health_unit(
    health_unit_id: int,
    health_unit_update: HealthUnitUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing health unit.
    
    **Path Parameters:**
    - health_unit_id: Health unit ID to update
    
    **Request Body:**
    - Any health unit fields to update (all optional)
    
    **Returns:**
    - Updated health unit data
    
    **Raises:**
    - 404: Health unit not found
    - 409: Health unit name already exists (if updating name)
    """
    return HealthUnitService.update_health_unit(db, health_unit_id, health_unit_update)


@router.delete("/health-units/{health_unit_id}", status_code=status.HTTP_200_OK)
def delete_health_unit(
    health_unit_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a health unit (soft delete).
    
    **Path Parameters:**
    - health_unit_id: Health unit ID to delete
    
    **Returns:**
    - Success message
    
    **Raises:**
    - 404: Health unit not found
    """
    HealthUnitService.delete_health_unit(db, health_unit_id)
    return {"detail": "Health unit deleted"}
