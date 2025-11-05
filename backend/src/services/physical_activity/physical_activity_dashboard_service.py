from sqlalchemy.orm import Session
from sqlalchemy import func, and_, desc
from typing import List, Dict, Any, Optional
from datetime import date, timedelta
from db.physical_activity.physical_activity_patient_crud import (
    count_physical_activity_patients,
    get_physical_activity_patients_by_age_range,
    get_patients_with_conditions
)
from db.physical_activity.physical_activity_evaluation_crud import (
    get_evaluations_by_who_compliance,
    get_evaluations_by_sedentary_risk,
    get_critical_sedentary_patients,
    get_activity_distribution_stats,
    get_who_compliance_stats,
    get_monthly_evaluation_counts,
    get_latest_evaluation_by_patient
)
from models.physical_activity.physical_activity_patient import PhysicalActivityPatient
from models.physical_activity.physical_activity_evaluation import PhysicalActivityEvaluation


class PhysicalActivityDashboardService:
    """Service layer for Physical Activity Dashboard operations"""
    
    @staticmethod
    def get_summary(db: Session) -> Dict[str, Any]:
        """Get general summary statistics"""
        # Total patients evaluated
        total_patients = count_physical_activity_patients(db, active_only=True)
        
        # WHO compliance statistics
        who_stats = get_who_compliance_stats(db)
        
        # Average sedentary hours
        activity_stats = get_activity_distribution_stats(db)
        
        return {
            "total_patients_evaluated": total_patients,
            "who_compliance_percentage": who_stats.get('compliance_percentage', 0),
            "average_sedentary_hours": round(activity_stats.get('avg_sedentary_daily', 0), 1),
            "total_evaluations": who_stats.get('total_evaluations', 0),
            "compliant_patients": who_stats.get('compliant_count', 0)
        }
    
    @staticmethod
    def get_critical_patients(db: Session) -> List[Dict[str, Any]]:
        """Get patients with critical sedentary risk (>10 hours/day)"""
        critical_evaluations = get_critical_sedentary_patients(db)
        
        critical_patients = []
        for evaluation in critical_evaluations:
            patient_data = {
                "patient_id": evaluation.patient_id,
                "patient_name": evaluation.patient.nome_completo,
                "cpf": evaluation.patient.cpf,
                "age": evaluation.patient.idade,
                "bairro": evaluation.patient.bairro,
                "sedentary_hours_per_day": evaluation.sedentary_hours_per_day,
                "evaluation_date": evaluation.data_avaliacao,
                "who_compliance": evaluation.who_compliance,
                "health_unit": evaluation.patient.health_unit.nome if evaluation.patient.health_unit else None
            }
            critical_patients.append(patient_data)
        
        # Sort by sedentary hours (highest first)
        critical_patients.sort(key=lambda x: x['sedentary_hours_per_day'], reverse=True)
        
        return critical_patients
    
    @staticmethod
    def get_activity_distribution(db: Session) -> Dict[str, Any]:
        """Get distribution by activity intensity"""
        activity_stats = get_activity_distribution_stats(db)
        
        return {
            "light_activity": {
                "label": "Leve",
                "average_weekly_minutes": round(activity_stats.get('avg_light_weekly', 0), 1),
                "color": "#2A9D90"
            },
            "moderate_activity": {
                "label": "Moderada", 
                "average_weekly_minutes": round(activity_stats.get('avg_moderate_weekly', 0), 1),
                "color": "#E76E50"
            },
            "vigorous_activity": {
                "label": "Vigorosa",
                "average_weekly_minutes": round(activity_stats.get('avg_vigorous_weekly', 0), 1),
                "color": "#274754"
            }
        }
    
    @staticmethod
    def get_sedentary_by_age(db: Session) -> List[Dict[str, Any]]:
        """Get sedentary hours by age range"""
        age_ranges = ["60-70", "71-80", "81+"]
        results = []
        
        for age_range in age_ranges:
            # Get patients in age range
            patients = get_physical_activity_patients_by_age_range(db, age_range)
            
            if not patients:
                results.append({
                    "age_range": age_range,
                    "average_sedentary_hours": 0,
                    "patient_count": 0
                })
                continue
            
            # Get latest evaluations for these patients
            total_sedentary_hours = 0
            evaluation_count = 0
            
            for patient in patients:
                latest_eval = get_latest_evaluation_by_patient(db, patient.id)
                if latest_eval:
                    total_sedentary_hours += latest_eval.sedentary_hours_per_day
                    evaluation_count += 1
            
            avg_sedentary = total_sedentary_hours / evaluation_count if evaluation_count > 0 else 0
            
            results.append({
                "age_range": age_range,
                "average_sedentary_hours": round(avg_sedentary, 1),
                "patient_count": len(patients),
                "evaluated_count": evaluation_count
            })
        
        return results
    
    @staticmethod
    def get_sedentary_trend(db: Session, months: int = 12) -> Dict[str, List[Dict[str, Any]]]:
        """Get sedentary trend over time for diabetics and hypertensives"""
        # Get patients with diabetes and hypertension
        diabetic_patients = get_patients_with_conditions(db, ["diabetes", "diabético", "diabética"])
        hypertensive_patients = get_patients_with_conditions(db, ["hipertensão", "hipertenso", "hipertensa", "pressão alta"])
        
        diabetic_ids = [p.id for p in diabetic_patients]
        hypertensive_ids = [p.id for p in hypertensive_patients]
        
        # Calculate trends for each condition
        start_date = date.today() - timedelta(days=months * 30)
        
        # Get monthly averages for diabetics using SQLite-compatible date functions
        diabetic_trend = db.query(
            func.strftime('%Y-%m', PhysicalActivityEvaluation.data_avaliacao).label('month'),
            func.avg(PhysicalActivityEvaluation.sedentary_hours_per_day).label('avg_sedentary')
        ).filter(
            and_(
                PhysicalActivityEvaluation.patient_id.in_(diabetic_ids) if diabetic_ids else False,
                PhysicalActivityEvaluation.data_avaliacao >= start_date
            )
        ).group_by(
            func.strftime('%Y-%m', PhysicalActivityEvaluation.data_avaliacao)
        ).order_by('month').all()
        
        # Get monthly averages for hypertensives using SQLite-compatible date functions
        hypertensive_trend = db.query(
            func.strftime('%Y-%m', PhysicalActivityEvaluation.data_avaliacao).label('month'),
            func.avg(PhysicalActivityEvaluation.sedentary_hours_per_day).label('avg_sedentary')
        ).filter(
            and_(
                PhysicalActivityEvaluation.patient_id.in_(hypertensive_ids) if hypertensive_ids else False,
                PhysicalActivityEvaluation.data_avaliacao >= start_date
            )
        ).group_by(
            func.strftime('%Y-%m', PhysicalActivityEvaluation.data_avaliacao)
        ).order_by('month').all()
        
        return {
            "diabetics": [
                {
                    "month": result.month,
                    "average_sedentary_hours": round(float(result.avg_sedentary), 1)
                }
                for result in diabetic_trend
            ],
            "hypertensives": [
                {
                    "month": result.month,
                    "average_sedentary_hours": round(float(result.avg_sedentary), 1)
                }
                for result in hypertensive_trend
            ]
        }
    
    @staticmethod
    def get_who_compliance(db: Session) -> Dict[str, Any]:
        """Get WHO compliance data"""
        who_stats = get_who_compliance_stats(db)
        
        compliant_count = who_stats.get('compliant_count', 0)
        total_count = who_stats.get('total_evaluations', 0)
        non_compliant_count = total_count - compliant_count
        
        return {
            "compliant": {
                "count": compliant_count,
                "percentage": round((compliant_count / total_count * 100) if total_count > 0 else 0, 1),
                "label": "Conforme OMS"
            },
            "non_compliant": {
                "count": non_compliant_count,
                "percentage": round((non_compliant_count / total_count * 100) if total_count > 0 else 0, 1),
                "label": "Não Conforme OMS"
            },
            "total_evaluations": total_count
        }
    
    @staticmethod
    def get_all_patients_summary(db: Session) -> List[Dict[str, Any]]:
        """Get summary of all patients with their latest evaluation"""
        # Get all active patients
        patients = db.query(PhysicalActivityPatient).filter(
            PhysicalActivityPatient.ativo == True
        ).all()
        
        patients_summary = []
        
        for patient in patients:
            # Get latest evaluation
            latest_eval = get_latest_evaluation_by_patient(db, patient.id)
            
            patient_data = {
                "id": patient.id,
                "nome_completo": patient.nome_completo,
                "cpf": patient.cpf,
                "idade": patient.idade,
                "bairro": patient.bairro,
                "health_unit": patient.health_unit.nome if patient.health_unit else None,
                "data_cadastro": patient.data_cadastro,
                "has_evaluation": latest_eval is not None
            }
            
            if latest_eval:
                patient_data.update({
                    "last_evaluation_date": latest_eval.data_avaliacao,
                    "sedentary_hours_per_day": latest_eval.sedentary_hours_per_day,
                    "sedentary_risk_level": latest_eval.sedentary_risk_level,
                    "who_compliance": latest_eval.who_compliance,
                    "total_weekly_moderate_minutes": latest_eval.total_weekly_moderate_minutes,
                    "total_weekly_vigorous_minutes": latest_eval.total_weekly_vigorous_minutes
                })
            else:
                patient_data.update({
                    "last_evaluation_date": None,
                    "sedentary_hours_per_day": None,
                    "sedentary_risk_level": None,
                    "who_compliance": None,
                    "total_weekly_moderate_minutes": None,
                    "total_weekly_vigorous_minutes": None
                })
            
            patients_summary.append(patient_data)
        
        # Sort by last evaluation date (most recent first), then by registration date
        patients_summary.sort(
            key=lambda x: (
                x['last_evaluation_date'] or date.min,
                x['data_cadastro']
            ),
            reverse=True
        )
        
        return patients_summary