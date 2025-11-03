from sqlalchemy.orm import Session
from typing import Dict, List, Optional
from datetime import date, datetime, timedelta
from db.factf import factf_patient_crud, factf_evaluation_crud
from models.factf.factf_patient import FACTFPatient
from models.factf.factf_evaluation import FACTFEvaluation


class FACTFDashboardService:
    """Service layer for FACT-F dashboard data"""
    
    @staticmethod
    def get_summary_stats(db: Session) -> Dict:
        """
        Get summary statistics for FACT-F dashboard.
        
        Returns:
            Dict with total patients, critical patients, average scores, etc.
        """
        # Total patients
        total_patients = factf_patient_crud.count_factf_patients(db, active_only=True)
        
        # Critical patients (fatigue score <= 30)
        critical_patients = factf_evaluation_crud.get_critical_patients(db, min_fatigue_score=30.0)
        critical_count = len(critical_patients)
        
        # Calculate percentage of severe fatigue
        severe_fatigue_percentage = (critical_count / total_patients * 100) if total_patients > 0 else 0
        
        # Get domain averages
        domain_averages = factf_evaluation_crud.get_domain_averages(db)
        
        # Calculate monthly growth (last 30 days vs previous 30 days)
        today = date.today()
        last_30_days = today - timedelta(days=30)
        previous_30_days = today - timedelta(days=60)
        
        recent_evaluations = len(factf_evaluation_crud.get_evaluations_by_date_range(
            db, last_30_days, today
        ))
        previous_evaluations = len(factf_evaluation_crud.get_evaluations_by_date_range(
            db, previous_30_days, last_30_days
        ))
        
        growth_percentage = 0
        if previous_evaluations > 0:
            growth_percentage = ((recent_evaluations - previous_evaluations) / previous_evaluations) * 100
        
        return {
            "total_patients": total_patients,
            "severe_fatigue_percentage": round(severe_fatigue_percentage, 1),
            "critical_patients_count": critical_count,
            "average_total_score": round(domain_averages.get('pontuacao_total', 0), 1),
            "monthly_growth_percentage": round(growth_percentage, 1),
            "domain_averages": {
                "physical": round(domain_averages.get('bem_estar_fisico', 0), 1),
                "social": round(domain_averages.get('bem_estar_social', 0), 1),
                "emotional": round(domain_averages.get('bem_estar_emocional', 0), 1),
                "functional": round(domain_averages.get('bem_estar_funcional', 0), 1),
                "fatigue": round(domain_averages.get('subescala_fadiga', 0), 1)
            }
        }
    
    @staticmethod
    def get_critical_patients(db: Session, min_score: float = 30.0) -> List[Dict]:
        """
        Get patients with critical fatigue levels.
        
        Args:
            db: Database session
            min_score: Minimum fatigue score threshold
            
        Returns:
            List of critical patients with their data
        """
        critical_patients = factf_evaluation_crud.get_critical_patients(db, min_score)
        
        return [
            {
                "id": patient.id,
                "name": patient.nome_completo,
                "age": patient.idade,
                "neighborhood": patient.bairro,
                "total_score": float(patient.pontuacao_total),
                "fatigue_score": float(patient.pontuacao_fadiga),
                "classification": patient.classificacao_fadiga,
                "evaluation_date": patient.data_avaliacao.isoformat()
            }
            for patient in critical_patients
        ]
    
    @staticmethod
    def get_fatigue_distribution_by_condition(db: Session) -> List[Dict]:
        """
        Get fatigue level distribution by health conditions.
        
        Returns:
            List with fatigue distribution data
        """
        # This is a simplified version - in a real scenario, you'd need
        # to parse comorbidities and group by specific conditions
        
        # Get all evaluations with patient data
        evaluations = db.query(FACTFEvaluation, FACTFPatient.comorbidades).join(
            FACTFPatient, FACTFEvaluation.patient_id == FACTFPatient.id
        ).filter(FACTFPatient.ativo == True).all()
        
        # Group by classification
        distribution = {
            "Sem Fadiga": 0,
            "Fadiga Leve": 0,
            "Fadiga Grave": 0
        }
        
        for evaluation, _ in evaluations:
            if evaluation.classificacao_fadiga in distribution:
                distribution[evaluation.classificacao_fadiga] += 1
        
        total = sum(distribution.values())
        
        # Convert to percentages
        return [
            {
                "condition": "Geral",  # Simplified - would be specific conditions
                "no_fatigue": round((distribution["Sem Fadiga"] / total * 100) if total > 0 else 0, 1),
                "mild_fatigue": round((distribution["Fadiga Leve"] / total * 100) if total > 0 else 0, 1),
                "severe_fatigue": round((distribution["Fadiga Grave"] / total * 100) if total > 0 else 0, 1)
            }
        ]
    
    @staticmethod
    def get_monthly_evolution(db: Session, months_back: int = 12) -> List[Dict]:
        """
        Get monthly evolution of FACT-F scores.
        
        Args:
            db: Database session
            months_back: Number of months to look back
            
        Returns:
            List with monthly evolution data
        """
        today = date.today()
        start_date = today - timedelta(days=months_back * 30)
        
        # Get evaluations in the period
        evaluations = factf_evaluation_crud.get_evaluations_by_date_range(
            db, start_date, today, limit=10000
        )
        
        # Group by month
        monthly_data = {}
        
        for evaluation in evaluations:
            month_key = evaluation.data_avaliacao.strftime("%Y-%m")
            
            if month_key not in monthly_data:
                monthly_data[month_key] = {
                    "total_scores": [],
                    "fatigue_scores": []
                }
            
            monthly_data[month_key]["total_scores"].append(evaluation.pontuacao_total)
            monthly_data[month_key]["fatigue_scores"].append(evaluation.subescala_fadiga)
        
        # Calculate averages
        result = []
        for month_key in sorted(monthly_data.keys()):
            data = monthly_data[month_key]
            
            avg_total = sum(data["total_scores"]) / len(data["total_scores"])
            avg_fatigue = sum(data["fatigue_scores"]) / len(data["fatigue_scores"])
            
            # Convert month to readable format
            month_date = datetime.strptime(month_key, "%Y-%m")
            month_name = month_date.strftime("%b")
            
            result.append({
                "month": month_name,
                "average_total_score": round(avg_total, 1),
                "average_fatigue_score": round(avg_fatigue, 1),
                "evaluations_count": len(data["total_scores"])
            })
        
        return result
    
    @staticmethod
    def get_domain_distribution(db: Session) -> Dict:
        """
        Get average scores distribution by domains.
        
        Returns:
            Dict with domain averages for radar chart
        """
        domain_averages = factf_evaluation_crud.get_domain_averages(db)
        
        return {
            "domains": [
                {
                    "domain": "Físico",
                    "average_score": round(domain_averages.get('bem_estar_fisico', 0), 1),
                    "max_score": 28
                },
                {
                    "domain": "Social", 
                    "average_score": round(domain_averages.get('bem_estar_social', 0), 1),
                    "max_score": 28
                },
                {
                    "domain": "Emocional",
                    "average_score": round(domain_averages.get('bem_estar_emocional', 0), 1),
                    "max_score": 24
                },
                {
                    "domain": "Funcional",
                    "average_score": round(domain_averages.get('bem_estar_funcional', 0), 1),
                    "max_score": 28
                },
                {
                    "domain": "Fadiga",
                    "average_score": round(domain_averages.get('subescala_fadiga', 0), 1),
                    "max_score": 52
                }
            ]
        }