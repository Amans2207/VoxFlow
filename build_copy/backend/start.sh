#!/bin/bash

echo "🚀 VoxFlow Neural Core: Starting Pod Deployment..."

# 1. Update System & Install FFmpeg
echo "📦 Installing System Dependencies (FFmpeg)..."
apt-get update && apt-get install -y ffmpeg

# 2. Install Python Dependencies
echo "🐍 Installing Python Packages..."
pip install --upgrade pip
pip install -r requirements.txt

# 3. Create necessary directories
echo "📁 Initializing I/O Buffers..."
mkdir -p uploads exports user_voices

# 4. Start the Production Server
echo "🔥 Launching Neural Core on 0.0.0.0:5000..."
python main.py
