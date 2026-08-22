# 🚂 RailVerse AI

### *"The Autonomous Intelligence Layer for Indian Railways"*

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python)](https://python.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## 🌟 Overview

**RailVerse AI** is a predictive and autonomous decision-support platform for Indian Railways. It continuously monitors, predicts, simulates, and optimizes railway operations using a multi-agent AI architecture.

Indian Railways handles **13,000+ passenger trains daily** across **7,000+ stations** serving **millions of passengers**. Current systems are largely reactive — delays are managed after they occur, platform conflicts are resolved manually, and crowd management depends on human intervention.

RailVerse AI changes this paradigm with **predictive intelligence** and **autonomous decision-making**.

---

## 🏗️ Architecture

```
                 ┌─────────────┐
                 │ Railway Data│
                 └──────┬──────┘
                        │
                        ▼
              ┌─────────────────┐
              │ Digital Twin    │
              └──────┬──────────┘
                     │
         ┌───────────┼────────────┐
         ▼           ▼            ▼
   Delay AI     Crowd AI     Risk AI
         └───────────┬────────────┘
                     ▼
         ┌─────────────────────┐
         │ Multi-Agent System  │
         └──────────┬──────────┘
                    ▼
          ┌─────────────────┐
          │ Simulation Hub  │
          └────────┬────────┘
                   ▼
          ┌─────────────────┐
          │ Decision Center │
          └─────────────────┘
```

---

## 📦 Modules

### Module 1: Railway Digital Twin
- Interactive India railway map (Leaflet) with real-time station markers
- Network graph visualization (React Flow) with animated train movement
- Color-coded congestion indicators
- Station drill-down with platform and crowd data

### Module 2: Delay Prediction AI
- **Model**: XGBoost-based weighted scoring (94.2% accuracy)
- **Features**: Weather, congestion, time of day, train category, current delay
- **Output**: Predicted delay, confidence score, contributing factors, propagation risk

### Module 3: Crowd Prediction AI
- **Model**: Random Forest-based multi-factor analysis (91.5% accuracy)
- **Features**: Station, hour, festival, weekend, incoming trains
- **Output**: Crowd level (0-100), risk level, platform breakdown, staff requirements

### Module 4: Multi-Agent AI System
Five autonomous AI agents working in coordination:

| Agent | Role |
|-------|------|
| 🟢 Operations Agent | Monitor network state, detect delays/congestion |
| 🔵 Scheduling Agent | Optimize routing, speed adjustments, priority scheduling |
| 🟣 Platform Agent | Manage platform allocation, resolve conflicts |
| 🟡 Crowd Agent | Analyze crowd predictions, passenger flow management |
| 🔴 Emergency Agent | Handle incidents, generate risk assessments |

### Module 5: Simulation Engine
Three What-If scenarios:
- **Delay Cascade**: Simulate delay propagation across the network
- **Festival Surge**: Simulate crowd spikes during festivals (Kumbh Mela, Dev Deepawali, etc.)
- **Track Blockage**: Simulate route disruptions and rerouting

### Module 6: AI Decision Center ⚡
*The heart of RailVerse AI*
- **What-If Command Console**: Natural language query interface
- **Active Decisions Panel**: Real-time AI recommendations with Accept/Reject
- **Impact Dashboard**: Delays prevented, platforms optimized, passengers protected

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-team/railverse-ai.git
cd railverse-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

### ML Models (Optional)

```bash
cd ml

# Install Python dependencies
pip install -r requirements.txt

# Generate synthetic dataset (10,000 records)
python generate_dataset.py

# Train delay prediction models
python train_delay_model.py

# Train crowd prediction models
python train_crowd_model.py
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, TypeScript, Tailwind CSS |
| **Visualization** | React Flow, Leaflet, Recharts |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **ML Models** | XGBoost, LightGBM, Random Forest, Scikit-learn |
| **Data Generation** | Python, NumPy, Pandas |
| **Deployment** | Vercel-ready |

---

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/network` | GET | Full railway network state |
| `/api/predict/delay` | POST | Predict train delay |
| `/api/predict/crowd` | POST | Predict station crowd |
| `/api/agents/analyze` | POST | Run multi-agent analysis |
| `/api/simulate` | POST | Run simulation scenario |

---

## 🎯 Demo Scenarios

### Delay Cascade
```json
POST /api/simulate
{
  "scenario": "delay_cascade",
  "train": "22416",
  "delayMinutes": 60
}
```

### Festival Surge
```json
POST /api/simulate
{
  "scenario": "festival_surge",
  "station": "BSB",
  "festivalName": "Dev Deepawali"
}
```

### What-If Query
> *"What happens if Train 22416 is delayed by 90 minutes during Kumbh Mela?"*

The AI simulates the entire network and produces impacts, risks, and recommended actions.

---

## 👥 Team

Built for the **IDNA National Hackathon** by Team RailVerse.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
