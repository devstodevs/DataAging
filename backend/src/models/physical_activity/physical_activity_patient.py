from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from db.base import Base
from datetime import date


class PhysicalActivityPatient(Base):
    """Physical Activity Patient ORM model"""
    __tablename__ = "physical_activity_patients"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Basic information
    nome_completo = Column(String(255), nullable=False)
    cpf = Column(String(11), unique=True, nullable=False, index=True)
    idade = Column(Integer, nullable=False)
    telefone = Column(String(20), nullable=True)
    email = Column(String(255), nullable=True)
    
    # Location
    bairro = Column(String(100), nullable=False)
    unidade_saude_id = Column(Integer, ForeignKey("health_units.id"), nullable=False)
    
    # Medical information
    diagnostico_principal = Column(String(255), nullable=True)
    comorbidades = Column(Text, nullable=True)
    medicamentos_atuais = Column(Text, nullable=True)
    
    # Status and dates
    data_cadastro = Column(Date, default=date.today, nullable=False)
    ativo = Column(Boolean, default=True, nullable=False)
    
    # Relationships
    health_unit = relationship("HealthUnit", back_populates="physical_activity_patients")
    evaluations = relationship("PhysicalActivityEvaluation", back_populates="patient", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<PhysicalActivityPatient(id={self.id}, nome={self.nome_completo}, cpf={self.cpf}, idade={self.idade})>"