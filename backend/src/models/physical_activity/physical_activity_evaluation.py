from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey, Float, Text, JSON
from sqlalchemy.orm import relationship
from db.base import Base


class PhysicalActivityEvaluation(Base):
    """Physical Activity Evaluation ORM model"""
    __tablename__ = "physical_activity_evaluations"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    patient_id = Column(Integer, ForeignKey("physical_activity_patients.id"), nullable=False)
    data_avaliacao = Column(Date, nullable=False, index=True)
    
    # Physical Activity by Intensity
    light_activity_minutes_per_day = Column(Integer, default=0, nullable=False)
    light_activity_days_per_week = Column(Integer, default=0, nullable=False)
    moderate_activity_minutes_per_day = Column(Integer, default=0, nullable=False)
    moderate_activity_days_per_week = Column(Integer, default=0, nullable=False)
    vigorous_activity_minutes_per_day = Column(Integer, default=0, nullable=False)
    vigorous_activity_days_per_week = Column(Integer, default=0, nullable=False)
    
    # Sedentary behavior
    sedentary_hours_per_day = Column(Float, nullable=False)
    screen_time_hours_per_day = Column(Float, default=0, nullable=False)
    
    # Automatic calculations
    total_weekly_moderate_minutes = Column(Integer, default=0, nullable=False)
    total_weekly_vigorous_minutes = Column(Integer, default=0, nullable=False)
    who_compliance = Column(Boolean, default=False, nullable=False, index=True)
    sedentary_risk_level = Column(String(20), default="Baixo", nullable=False, index=True)
    
    # Optional fields
    respostas_detalhadas = Column(JSON, nullable=True)
    observacoes = Column(Text, nullable=True)
    profissional_responsavel = Column(String(255), nullable=True)
    
    # Relationships
    patient = relationship("PhysicalActivityPatient", back_populates="evaluations")
    
    def __repr__(self):
        return f"<PhysicalActivityEvaluation(id={self.id}, patient_id={self.patient_id}, data={self.data_avaliacao})>"