#!/usr/bin/env zsh

# Exit on error
set -e

# Check if Docker is running
if ! docker info &>/dev/null; then
    echo "Error: Docker is not running"
    exit 1
fi

# Build frontend
echo "Building frontend..."
if ! docker build -t frontend:latest services/frontend; then
    echo "Error: Frontend build failed"
    exit 1
fi

# Build backend
echo "Building backend..."
if ! docker build -t backend:latest services/backend; then
    echo "Error: Backend build failed"
    exit 1
fi

# Run docker-compose
echo "Starting services..."
if ! docker-compose up -d; then
    echo "Error: Failed to start services"
    exit 1
fi

echo "Build and deployment completed successfully"