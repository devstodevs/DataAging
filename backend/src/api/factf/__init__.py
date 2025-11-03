from .factf_patient import router as factf_patient_router
from .factf_evaluation import router as factf_evaluation_router
from .factf_dashboard import router as factf_dashboard_router

__all__ = ["factf_patient_router", "factf_evaluation_router", "factf_dashboard_router"]