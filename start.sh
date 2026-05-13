#!/bin/bash

# VoxFlow Ignition Script (Mac/Linux)

echo "Launching VoxFlow Backend..."
cd backend && python3 main.py &

echo "Launching VoxFlow Frontend..."
cd ../frontend && npm run dev &

echo "VoxFlow nodes are initializing. Check ports 5001 and 3000."
wait
