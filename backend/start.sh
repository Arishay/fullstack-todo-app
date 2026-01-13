#!/bin/bash
# Startup script for Railway deployment

# Set default PORT if not provided
PORT=${PORT:-8000}

# Start uvicorn server
exec uvicorn src.main:app --host 0.0.0.0 --port "$PORT"
