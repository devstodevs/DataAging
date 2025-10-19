from fastapi import FastAPI
from api.auth import router as auth_router
from api.user import router as user_router
from config import settings
from db.base import engine, Base
from models import user  # Import models to register them

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="DataAging API - Sistema de Gerenciamento"
)

# Include routers
app.include_router(auth_router, prefix=settings.API_V1_PREFIX, tags=["auth"])
app.include_router(user_router, prefix=settings.API_V1_PREFIX, tags=["users"])

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