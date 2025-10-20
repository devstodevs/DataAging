from .health_unit import router as health_unit_router
from .ivcf_patient import router as ivcf_patient_router
from .ivcf_evaluation import router as ivcf_evaluation_router
from .dashboard import router as dashboard_router

__all__ = [
    "health_unit_router",
    "ivcf_patient_router",
    "ivcf_evaluation_router", 
    "dashboard_router"
]
