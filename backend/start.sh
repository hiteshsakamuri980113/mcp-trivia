#!/bin/bash
# Start script for Render deployment with extended timeouts
python -m uvicorn main:app --host 0.0.0.0 --port $PORT --timeout-keep-alive 30 --timeout-graceful-shutdown 30
