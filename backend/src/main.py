from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.auth import auth_router
from api.user import user_router
from api.ivcf import health_unit_router, ivcf_patient_router, ivcf_evaluation_router, ivcf_dashboard_router
from config import settings
from db.base import engine, Base
from models import user, ivcf  # Import models to register them

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="DataAging API - Sistema de Gerenciamento"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix=settings.API_V1_PREFIX, tags=["auth"])
app.include_router(user_router, prefix=settings.API_V1_PREFIX, tags=["users"])
app.include_router(health_unit_router, prefix=settings.API_V1_PREFIX, tags=["health-units"])
app.include_router(ivcf_patient_router, prefix=settings.API_V1_PREFIX, tags=["ivcf-patients"])
app.include_router(ivcf_evaluation_router, prefix=settings.API_V1_PREFIX, tags=["ivcf-evaluations"])
app.include_router(ivcf_dashboard_router, prefix=settings.API_V1_PREFIX, tags=["ivcf-dashboard"])

#DEBUG
@app.get("/debug/routes")
async def list_routes():
    routes = [
        {
            "path": route.path,
            "methods": list(route.methods),
            "name": route.name,
            "endpoint": route.endpoint.__name__
        }
        for route in app.routes
    ]
    return routes


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "Welcome to DataAging API",
        "version": "1.0.0",
        "docs": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)