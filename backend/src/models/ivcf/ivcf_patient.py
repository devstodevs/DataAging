from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from db.base import Base


class IVCFPatient(Base):
    """IVCF Patient ORM model"""
    __tablename__ = "ivcf_patients"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Basic information
    nome_completo = Column(String(200), nullable=False)
    cpf = Column(String(14), unique=True, nullable=False, index=True)
    idade = Column(Integer, nullable=False)
    telefone = Column(String(20), nullable=True)
    
    # Location
    bairro = Column(String(100), nullable=False)
    unidade_saude_id = Column(Integer, ForeignKey("health_units.id"), nullable=False)
    
    # Status and dates
    data_cadastro = Column(Date, nullable=False)
    ativo = Column(Boolean, default=True, nullable=False)
    
    # Relationships
    health_unit = relationship("HealthUnit", back_populates="patients")
    evaluations = relationship("IVCFEvaluation", back_populates="patient", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<IVCFPatient(id={self.id}, nome={self.nome_completo}, cpf={self.cpf}, idade={self.idade})>"
