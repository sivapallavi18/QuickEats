#!/bin/bash

# Build script for Render deployment

echo "Installing backend dependencies..."
cd backend
npm install

echo "Installing frontend dependencies..."
cd ..
npm install

echo "Building frontend..."
npm run build

echo "Build completed successfully!"