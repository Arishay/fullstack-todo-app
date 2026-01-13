# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy pyproject.toml and install dependencies
COPY pyproject.toml ./
RUN pip install --no-cache-dir -e .

# Copy application code
COPY . .

# Copy and make startup script executable
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Create a non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port (Railway will set PORT env variable)
EXPOSE 8000

# Use startup script
CMD ["/app/start.sh"]
