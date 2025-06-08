import os
import json
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.mcp_client.client import router

# Load environment variables
load_dotenv()

# Get CORS origins from environment variable
cors_origins_str = os.getenv("CORS_ORIGINS", '["http://localhost:5173"]')
cors_origins = json.loads(cors_origins_str)

# Create FastAPI app
app = FastAPI(
    title="Trivia API",
    description="API for extracting trivia questions",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(router, prefix="/api", tags=["MCP Client"])



