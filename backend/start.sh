#!/bin/bash
# Start script for Render deployment
python -m uvicorn main:app --host 0.0.0.0 --port $PORT
