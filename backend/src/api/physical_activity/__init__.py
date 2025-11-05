from .physical_activity_patient import router as physical_activity_patient_router
from .physical_activity_evaluation import router as physical_activity_evaluation_router
from .physical_activity_dashboard import router as physical_activity_dashboard_router

__all__ = [
    "physical_activity_patient_router",
    "physical_activity_evaluation_router", 
    "physical_activity_dashboard_router"
]