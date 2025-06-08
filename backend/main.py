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
try:
    cors_origins = json.loads(cors_origins_str)
except json.JSONDecodeError:
    cors_origins = ["http://localhost:5173"]

# Get port from environment (for Render deployment)
PORT = int(os.getenv("PORT", 8000))

# Create FastAPI app
app = FastAPI(
    title="MCP Trivia API",
    description="AI-powered trivia questions using Model Context Protocol and Google AI",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(router, prefix="/api", tags=["MCP Client"])

# Health check endpoint
@app.get("/")
async def root():
    return {
        "message": "MCP Trivia API is running",
        "version": "1.0.0",
        "status": "healthy"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)



