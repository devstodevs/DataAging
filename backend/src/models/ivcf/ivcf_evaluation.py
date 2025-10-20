from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from db.base import Base


class IVCFEvaluation(Base):
    """IVCF-20 Evaluation ORM model"""
    __tablename__ = "ivcf_evaluations"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Foreign key
    patient_id = Column(Integer, ForeignKey("ivcf_patients.id"), nullable=False)
    
    # Evaluation date
    data_avaliacao = Column(Date, nullable=False)
    
    # Total score and classification
    pontuacao_total = Column(Integer, nullable=False)
    classificacao = Column(String(20), nullable=False)
    
    # Individual domain scores (0-5 each)
    dominio_idade = Column(Integer, nullable=False)
    dominio_comorbidades = Column(Integer, nullable=False)
    dominio_comunicacao = Column(Integer, nullable=False)
    dominio_mobilidade = Column(Integer, nullable=False)
    dominio_humor = Column(Integer, nullable=False)
    dominio_cognicao = Column(Integer, nullable=False)
    dominio_avd = Column(Integer, nullable=False)
    dominio_autopercepcao = Column(Integer, nullable=False)
    
    # Additional information
    comorbidades = Column(Text, nullable=True)
    observacoes = Column(Text, nullable=True)
    
    # Relationships
    patient = relationship("IVCFPatient", back_populates="evaluations")
    
    # Constraints
    __table_args__ = (
        CheckConstraint('pontuacao_total >= 0 AND pontuacao_total <= 40', name='check_pontuacao_total'),
        CheckConstraint('dominio_idade >= 0 AND dominio_idade <= 5', name='check_dominio_idade'),
        CheckConstraint('dominio_comorbidades >= 0 AND dominio_comorbidades <= 5', name='check_dominio_comorbidades'),
        CheckConstraint('dominio_comunicacao >= 0 AND dominio_comunicacao <= 5', name='check_dominio_comunicacao'),
        CheckConstraint('dominio_mobilidade >= 0 AND dominio_mobilidade <= 5', name='check_dominio_mobilidade'),
        CheckConstraint('dominio_humor >= 0 AND dominio_humor <= 5', name='check_dominio_humor'),
        CheckConstraint('dominio_cognicao >= 0 AND dominio_cognicao <= 5', name='check_dominio_cognicao'),
        CheckConstraint('dominio_avd >= 0 AND dominio_avd <= 5', name='check_dominio_avd'),
        CheckConstraint('dominio_autopercepcao >= 0 AND dominio_autopercepcao <= 5', name='check_dominio_autopercepcao'),
        CheckConstraint("classificacao IN ('Robusto', 'Em Risco', 'Frágil')", name='check_classificacao'),
    )
    
    def __repr__(self):
        return f"<IVCFEvaluation(id={self.id}, patient_id={self.patient_id}, pontuacao={self.pontuacao_total}, classificacao={self.classificacao})>"
