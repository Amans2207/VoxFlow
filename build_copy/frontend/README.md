# VoxFlow | Neural Creative Studio

VoxFlow is a professional-grade AI Video Production and Localization ecosystem. It leverages cutting-edge neural models (Whisper, F5-TTS, GPT-4o) and high-performance media pipelines (FFmpeg) to transform raw assets into viral-ready, localized content.

---

## 🛠️ Tech Stack
- **Frontend**: Next.js 15 (App Router), Framer Motion, Lucide React, CSS Modules.
- **Backend**: Python FastAPI, FFmpeg, MoviePy, PyTorch (CUDA).
- **Database/Auth**: Supabase (PostgreSQL, Auth, Storage).
- **AI Core**: 
  - **F5-TTS**: Proprietary neural dubbing.
  - **Whisper**: High-precision kinetic captioning.
  - **GPT-4o**: Script generation and viral metadata.

---

## 🚀 Getting Started

### 1. Prerequisite
- Node.js 20+
- Python 3.10+ (with CUDA for local GPU rendering)
- Supabase Account

### 2. Frontend Setup
```bash
cd Voxflow
npm install
npm run dev
```
Accessible at: `http://localhost:3000`

### 3. Backend Setup (AI Service)
```bash
cd voxflow-ai-service
pip install -r requirements.txt
python main.py
```
Accessible at: `http://localhost:8000`

---

## 🎬 Key Features
- **CapCut-Pro AI Studio**: 40/60 split workspace for granular dubbing and FX design.
- **Auto-Pilot Mode**: Zero-effort multi-clip orchestration for viral Reels/Shorts.
- **Neural Marketplace**: P2P configuration store for template monetization.
- **ROI Command Center**: Advanced admin oversight with traffic heatmaps and GPU monitoring.

---

## 🔐 Security & Deployment
- **Docker Ready**: Use the provided `Dockerfile` for GPU-accelerated serverless deployment (RunPod/Lambda).
- **State Persistence**: All project versions and drafts are auto-saved to Supabase.

**Architected by Aman & Powered by Neural Logic.**
