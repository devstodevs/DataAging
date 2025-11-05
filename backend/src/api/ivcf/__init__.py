from .ivcf_patient import router as ivcf_patient_router
from .ivcf_evaluation import router as ivcf_evaluation_router
from .ivcf_dashboard import router as ivcf_dashboard_router

__all__ = [
    "ivcf_patient_router",
    "ivcf_evaluation_router", 
    "ivcf_dashboard_router"
]
