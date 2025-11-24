from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Dict
from db.base import get_db
from services.factf.factf_dashboard_service import FACTFDashboardService
from api.auth.auth import get_current_user
from models.user.user import User

router = APIRouter()


@router.get("/factf-dashboard/summary")
def get_factf_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict:
    """
    Get FACT-F dashboard summary statistics.
    
    **Returns:**
    - total_patients: Total number of active patients
    - severe_fatigue_percentage: Percentage of patients with severe fatigue
    - critical_patients_count: Number of patients with critical fatigue levels
    - average_total_score: Average total FACT-F score
    - monthly_growth_percentage: Growth percentage compared to previous month
    - domain_averages: Average scores by domain
    
    **Example Response:**
    ```json
    {
        "total_patients": 245,
        "severe_fatigue_percentage": 22.0,
        "critical_patients_count": 54,
        "average_total_score": 85.3,
        "monthly_growth_percentage": 12.0,
        "domain_averages": {
            "physical": 18.5,
            "social": 20.2,
            "emotional": 16.8,
            "functional": 19.1,
            "fatigue": 35.8
        }
    }
    ```
    """
    return FACTFDashboardService.get_summary_stats(db)


@router.get("/factf-dashboard/critical-patients")
def get_critical_patients(
    min_score: float = Query(30.0, ge=0, le=52, description="Minimum fatigue score threshold"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict:
    """
    Get patients with critical fatigue levels.
    
    **Query Parameters:**
    - min_score: Minimum fatigue score to be considered critical (default: 30.0)
    
    **Returns:**
    - List of patients with critical fatigue levels
    
    **Example Response:**
    ```json
    {
        "critical_patients": [
            {
                "id": 1,
                "name": "Paciente #1",
                "age": 67,
                "neighborhood": "Centro",
                "total_score": 65.5,
                "fatigue_score": 25.0,
                "classification": "Fadiga Grave",
                "evaluation_date": "2023-12-01"
            }
        ],
        "count": 1
    }
    ```
    """
    critical_patients = FACTFDashboardService.get_critical_patients(db, min_score)
    
    return {
        "critical_patients": critical_patients,
        "count": len(critical_patients)
    }


@router.get("/factf-dashboard/fatigue-distribution")
def get_fatigue_distribution(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict:
    """
    Get fatigue level distribution by health conditions.
    
    **Returns:**
    - Distribution of fatigue levels across different health conditions
    
    **Example Response:**
    ```json
    {
        "distribution": [
            {
                "condition": "Geral",
                "no_fatigue": 35.0,
                "mild_fatigue": 43.0,
                "severe_fatigue": 22.0
            }
        ]
    }
    ```
    """
    distribution = FACTFDashboardService.get_fatigue_distribution_by_condition(db)
    
    return {
        "distribution": distribution
    }

@router.get("/factf-dashboard/monthly-evolution")
def get_monthly_evolution(
    months_back: int = Query(12, ge=1, le=24, description="Number of months to look back"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict:
    """
    Get monthly evolution of FACT-F scores.
    
    **Query Parameters:**
    - months_back: Number of months to analyze (default: 12, max: 24)
    
    **Returns:**
    - Monthly evolution data for trend analysis
    
    **Example Response:**
    ```json
    {
        "evolution": [
            {
                "month": "Jan",
                "average_total_score": 82.5,
                "average_fatigue_score": 35.2,
                "evaluations_count": 45
            },
            {
                "month": "Feb", 
                "average_total_score": 84.1,
                "average_fatigue_score": 36.8,
                "evaluations_count": 52
            }
        ]
    }
    ```
    """
    evolution = FACTFDashboardService.get_monthly_evolution(db, months_back)
    
    return {
        "evolution": evolution
    }


@router.get("/factf-dashboard/domain-distribution")
def get_domain_distribution(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict:
    """
    Get average scores distribution by domains for radar chart.
    
    **Returns:**
    - Domain averages for radar chart visualization
    
    **Example Response:**
    ```json
    {
        "domains": [
            {
                "domain": "Físico",
                "average_score": 18.5,
                "max_score": 28
            },
            {
                "domain": "Social",
                "average_score": 20.2,
                "max_score": 28
            },
            {
                "domain": "Emocional",
                "average_score": 16.8,
                "max_score": 24
            },
            {
                "domain": "Funcional",
                "average_score": 19.1,
                "max_score": 28
            },
            {
                "domain": "Fadiga",
                "average_score": 35.8,
                "max_score": 52
            }
        ]
    }
    ```
    """
    return FACTFDashboardService.get_domain_distribution(db)


@router.get("/factf-dashboard/patient-domain-distribution/{patient_id}")
def get_patient_domain_distribution(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict:
    """
    Get individual patient domain scores compared with regional average.
    
    **Parameters:**
    - patient_id: ID of the patient to get individual scores
    
    **Returns:**
    - Individual patient domain scores and regional averages for comparison
    
    **Example Response:**
    ```json
    {
        "domains": [
            {
                "domain": "Físico",
                "patient_score": 22.0,
                "regional_average": 18.5,
                "max_score": 28
            },
            {
                "domain": "Social",
                "patient_score": 25.0,
                "regional_average": 20.2,
                "max_score": 28
            },
            {
                "domain": "Emocional",
                "patient_score": 18.0,
                "regional_average": 16.8,
                "max_score": 24
            },
            {
                "domain": "Funcional",
                "patient_score": 21.0,
                "regional_average": 19.1,
                "max_score": 28
            },
            {
                "domain": "Fadiga",
                "patient_score": 40.0,
                "regional_average": 35.8,
                "max_score": 52
            }
        ]
    }
    ```
    """
    return FACTFDashboardService.get_patient_domain_distribution(db, patient_id)


@router.get("/factf-dashboard/all-patients")
def get_all_patients_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict:
    """
    Get summary of all patients with their latest evaluation data.
    
    **Returns:**
    - List of all patients with basic info and latest evaluation
    
    **Example Response:**
    ```json
    {
        "patients": [
            {
                "id": 1,
                "name": "Paciente #1",
                "age": 66,
                "last_score": 85.5,
                "classification": "Fadiga Leve",
                "evaluation_date": "2023-12-01"
            }
        ],
        "total_count": 245
    }
    ```
    """
    # This would use the existing patient service to get all patients
    # with their latest evaluation data
    from services.factf.factf_patient_service import FACTFPatientService
    
    patients = FACTFPatientService.get_all_factf_patients(db, limit=1000)
    
    # Transform to summary format
    patients_summary = []
    for patient in patients:
        # Get latest evaluation for each patient
        from services.factf.factf_evaluation_service import FACTFEvaluationService
        latest_eval = FACTFEvaluationService.get_latest_evaluation_by_patient(db, patient.id)
        
        patient_data = {
            "id": patient.id,
            "name": patient.nome_completo,
            "age": patient.idade,
            "last_score": None,
            "classification": None,
            "evaluation_date": None
        }
        
        if latest_eval:
            patient_data.update({
                "last_score": float(latest_eval.pontuacao_total),
                "classification": latest_eval.classificacao_fadiga,
                "evaluation_date": latest_eval.data_avaliacao.isoformat()
            })
        
        patients_summary.append(patient_data)
    
    return {
        "patients": patients_summary,
        "total_count": len(patients_summary)
    }