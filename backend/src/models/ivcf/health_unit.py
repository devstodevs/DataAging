from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from db.base import Base


class HealthUnit(Base):
    """Health Unit ORM model"""
    __tablename__ = "health_units"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Basic information
    nome = Column(String(200), nullable=False)
    bairro = Column(String(100), nullable=False)
    regiao = Column(String(50), nullable=False)
    
    # Status
    ativo = Column(Boolean, default=True, nullable=False)
    
    # Relationships
    patients = relationship("IVCFPatient", back_populates="health_unit")
    factf_patients = relationship("FACTFPatient", back_populates="health_unit")
    
    def __repr__(self):
        return f"<HealthUnit(id={self.id}, nome={self.nome}, bairro={self.bairro}, regiao={self.regiao})>"
