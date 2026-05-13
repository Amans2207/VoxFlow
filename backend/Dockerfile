# Use NVIDIA CUDA base image
FROM nvidia/cuda:12.1.0-base-ubuntu22.04

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3-pip \
    python3-dev \
    ffmpeg \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt
RUN pip3 install runpod requests

# Copy project files
COPY . .

# Install MediaPipe/OpenCV dependencies
RUN apt-get update && apt-get install -y libgl1-mesa-glx libglib2.0-0

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV DEVICE=cuda

# Expose Port for API
EXPOSE 5001

# Run the API server as default
CMD [ "python3", "main.py" ]
