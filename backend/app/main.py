import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.models.database import engine, Base

from app.api import (
    websites,
    dashboard,
    keywords,
    rankings,
    audit,
    recommendations,
    experiments,
    competitors,
    citations,
    memory,
    learning,
    reports,
    demo,
)

from app.api.demo import reset_demo_data


# ---------------------------------------------------------
# Logging
# ---------------------------------------------------------

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger("rankmind.main")


# ---------------------------------------------------------
# Application Lifespan
# ---------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):

    # Startup tasks
    logger.info("Initializing RankMind AI database tables...")

    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized successfully.")
    except Exception as e:
        logger.warning(
            f"Database initialization warning: {e}"
        )

    # Demo mode
    if settings.DEMO_MODE:
        logger.info(
            "DEMO_MODE is active. "
            "Pre-populating Hindsight memory bank "
            "with baseline experiments..."
        )

        try:
            reset_demo_data()

            logger.info(
                "Demo data loaded successfully."
            )

        except Exception as e:
            logger.warning(
                f"Demo pre-population note: {e}"
            )

    yield

    # Shutdown
    logger.info(
        "Shutting down RankMind AI backend..."
    )


# ---------------------------------------------------------
# FastAPI Application
# ---------------------------------------------------------

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "AI SEO & Citation Intelligence Agent "
        "powered by Hindsight persistent memory."
    ),
    lifespan=lifespan,
)


# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------

app.add_middleware(
    CORSMiddleware,

    # Frontend development servers
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ---------------------------------------------------------
# API Routers
# ---------------------------------------------------------

app.include_router(websites.router)
app.include_router(dashboard.router)
app.include_router(keywords.router)
app.include_router(rankings.router)
app.include_router(audit.router)
app.include_router(recommendations.router)
app.include_router(experiments.router)
app.include_router(competitors.router)
app.include_router(citations.router)
app.include_router(memory.router)
app.include_router(learning.router)
app.include_router(reports.router)
app.include_router(demo.router)


# ---------------------------------------------------------
# Root Endpoint
# ---------------------------------------------------------

@app.get("/")
def root():
    return {
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "demo_mode": settings.DEMO_MODE,
        "docs_url": "/docs",
    }


# ---------------------------------------------------------
# Run Directly
# ---------------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )