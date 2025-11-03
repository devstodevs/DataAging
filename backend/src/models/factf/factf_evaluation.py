from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey, CheckConstraint, Float
from sqlalchemy.orm import relationship
from db.base import Base


class FACTFEvaluation(Base):
    """FACT-F Evaluation ORM model"""
    __tablename__ = "factf_evaluations"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Foreign key
    patient_id = Column(Integer, ForeignKey("factf_patients.id"), nullable=False)
    
    # Evaluation date
    data_avaliacao = Column(Date, nullable=False)
    
    # Total scores and classification
    pontuacao_total = Column(Float, nullable=False)  # 0-136
    pontuacao_fadiga = Column(Float, nullable=False)  # Subescala fadiga (0-52)
    classificacao_fadiga = Column(String(20), nullable=False)  # Sem Fadiga, Leve, Grave
    
    # Domain scores (FACT-G domains)
    bem_estar_fisico = Column(Float, nullable=False)      # 0-28
    bem_estar_social = Column(Float, nullable=False)      # 0-28  
    bem_estar_emocional = Column(Float, nullable=False)   # 0-24
    bem_estar_funcional = Column(Float, nullable=False)   # 0-28
    
    # Fatigue subscale (FACT-F specific)
    subescala_fadiga = Column(Float, nullable=False)      # 0-52
    
    # Individual question responses (optional for detailed analysis)
    respostas_detalhadas = Column(Text, nullable=True)  # JSON string with all answers
    
    # Additional information
    observacoes = Column(Text, nullable=True)
    profissional_responsavel = Column(String(200), nullable=True)
    
    # Relationships
    patient = relationship("FACTFPatient", back_populates="evaluations")    

    # Constraints
    __table_args__ = (
        CheckConstraint('pontuacao_total >= 0 AND pontuacao_total <= 136', name='check_pontuacao_total_factf'),
        CheckConstraint('pontuacao_fadiga >= 0 AND pontuacao_fadiga <= 52', name='check_pontuacao_fadiga'),
        CheckConstraint('bem_estar_fisico >= 0 AND bem_estar_fisico <= 28', name='check_bem_estar_fisico'),
        CheckConstraint('bem_estar_social >= 0 AND bem_estar_social <= 28', name='check_bem_estar_social'),
        CheckConstraint('bem_estar_emocional >= 0 AND bem_estar_emocional <= 24', name='check_bem_estar_emocional'),
        CheckConstraint('bem_estar_funcional >= 0 AND bem_estar_funcional <= 28', name='check_bem_estar_funcional'),
        CheckConstraint('subescala_fadiga >= 0 AND subescala_fadiga <= 52', name='check_subescala_fadiga'),
        CheckConstraint("classificacao_fadiga IN ('Sem Fadiga', 'Fadiga Leve', 'Fadiga Grave')", name='check_classificacao_fadiga'),
    )
    
    def __repr__(self):
        return f"<FACTFEvaluation(id={self.id}, patient_id={self.patient_id}, pontuacao_total={self.pontuacao_total}, classificacao={self.classificacao_fadiga})>"