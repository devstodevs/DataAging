from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from db.base import Base


class FACTFPatient(Base):
    """FACT-F Patient ORM model"""
    __tablename__ = "factf_patients"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Basic information
    nome_completo = Column(String(200), nullable=False)
    cpf = Column(String(14), unique=True, nullable=False, index=True)
    idade = Column(Integer, nullable=False)
    telefone = Column(String(20), nullable=True)
    email = Column(String(100), nullable=True)
    
    # Location
    bairro = Column(String(100), nullable=False)
    unidade_saude_id = Column(Integer, ForeignKey("health_units.id"), nullable=False)
    
    # Medical information
    diagnostico_principal = Column(String(200), nullable=True)
    comorbidades = Column(Text, nullable=True)
    tratamento_atual = Column(Text, nullable=True)
    
    # Status and dates
    data_cadastro = Column(Date, nullable=False)
    ativo = Column(Boolean, default=True, nullable=False)
    
    # Relationships
    health_unit = relationship("HealthUnit", back_populates="factf_patients")
    evaluations = relationship("FACTFEvaluation", back_populates="patient", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<FACTFPatient(id={self.id}, nome={self.nome_completo}, cpf={self.cpf}, idade={self.idade})>"